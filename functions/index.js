
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

/**
 * Cria uma sessão de checkout no Stripe para o profissional pagar a taxa de 25%.
 * É chamada pelo frontend quando o profissional clica em "Pagar Taxa".
 * Agora inclui lógica para aplicar cupons de desconto.
 */
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Verifica se o usuário está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Você precisa estar logado para pagar."
    );
  }

  const { servicoId, couponCode } = data; 
  const profissionalId = context.auth.uid;

  // Busca os dados do serviço no Firestore para calcular a taxa
  const servicoRef = db.collection("schedules").doc(servicoId);
  const servicoSnap = await servicoRef.get();
  
  if (!servicoSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Serviço não encontrado.");
  }
  
  const servicoData = servicoSnap.data();
  const valorServico = servicoData.value;
  const valorTaxa = valorServico * 0.25; // Calcula 25% do valor do serviço

  if (valorTaxa < 0.50) { // Stripe tem um valor mínimo de transação
       throw new functions.https.HttpsError("invalid-argument", "O valor da taxa é muito baixo para ser processado.");
  }

  // URLs para onde o Stripe redirecionará após o pagamento
  const successUrl = `https://lar-seguro-76fan.web.app/dashboard/services/${servicoId}?pagamento=sucesso`;
  const cancelUrl = `https://lar-seguro-76fan.web.app/dashboard/services/${servicoId}?pagamento=cancelado`;
  
  const checkoutOptions = {
      payment_method_types: ["card", "boleto"], 
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
              currency: 'brl',
              product_data: {
                  name: `Taxa de serviço: ${servicoData.service}`,
                  description: `Comissão da plataforma para o serviço do cliente ${servicoData.clientName}.`,
              },
              unit_amount: Math.round(valorTaxa * 100), // Valor em centavos
          },
          quantity: 1,
        },
      ],
      metadata: {
        servicoId: servicoId,
        profissionalId: profissionalId,
      },
      customer_email: context.auth.token.email,
      allow_promotion_codes: true,
  };

  // Aplica o cupom de desconto se um código for fornecido
  if (couponCode) {
    try {
      // Importante: O Stripe usa "promotion_codes" e não "coupons" diretamente aqui.
      // Você deve criar códigos promocionais no seu Dashboard do Stripe que se referem aos seus cupons.
      const promotionCodes = await stripe.promotionCodes.list({
        code: couponCode.toUpperCase(),
        active: true,
        limit: 1,
      });

      if (promotionCodes.data.length > 0) {
        checkoutOptions.discounts = [{
          promotion_code: promotionCodes.data[0].id,
        }];
      } else {
         // Lança um erro específico se o cupom não for encontrado ou estiver inativo
        throw new functions.https.HttpsError("invalid-argument", "O código de cupom fornecido é inválido ou expirou.");
      }
    } catch(error) {
       console.error("Erro ao buscar código promocional no Stripe:", error);
       // Re-lança o erro para o frontend com uma mensagem amigável
        if (error instanceof functions.https.HttpsError) {
          throw error;
        }
       throw new functions.https.HttpsError("internal", "Não foi possível validar o cupom de desconto.");
    }
  }


  try {
    const session = await stripe.checkout.sessions.create(checkoutOptions);

    // Salva o ID da sessão no documento do serviço para referência
    await servicoRef.update({
      "taxa.checkoutSessionId": session.id,
    });

    return { id: session.id };
  } catch (error) {
    console.error("Erro ao criar checkout do Stripe:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Não foi possível criar a sessão de pagamento."
    );
  }
});


/**
 * Webhook que ouve os eventos do Stripe.
 * O Stripe nos notifica aqui quando um pagamento é concluído.
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = functions.config().stripe.webhook_secret;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️ Erro na verificação do webhook.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lida com o evento 'checkout.session.completed'
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { servicoId, profissionalId } = session.metadata;

    try {
      const servicoRef = db.collection("schedules").doc(servicoId);
      const professionalDocRef = db.collection("professionals").doc(profissionalId);

      const [servicoSnap, professionalSnap] = await Promise.all([servicoRef.get(), professionalDocRef.get()]);
      
      if (!professionalSnap.exists()) {
          console.error(`Webhook: Documento do profissional com ID ${profissionalId} não foi encontrado.`);
          return res.status(404).send("Documento do profissional não encontrado.");
      }
      const professionalData = professionalSnap.data();
      
      // Atualiza o documento do serviço no Firestore para liberar o acesso
      await servicoRef.update({
        "taxa.statusPagamento": "PAGO",
        "taxa.profissionalId": profissionalId,
        professionalId: profissionalId,
        professionalName: professionalData.fullName,
        status: 'Confirmado',
      });
      console.log(`Pagamento para o serviço ${servicoId} foi bem-sucedido!`);

      // ---- INÍCIO DA LÓGICA DE NOTIFICAÇÃO ----
      const servicoData = servicoSnap.data();

      if (servicoData && professionalData) {
        
        // 1. Criar notificação no site para o cliente
        const notificacaoCliente = {
            userId: servicoData.clientId,
            title: "Seu serviço foi aceito!",
            description: `${professionalData.fullName} aceitou seu serviço de ${servicoData.service} e entrará em contato em breve.`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            link: `/dashboard/my-account`
        };
        await db.collection('notifications').add(notificacaoCliente);
        
        const emailApiUrl = `https://lar-seguro-76fan.web.app/api/send-email`;

        // 2. Enviar notificação por e-mail para o CLIENTE
        if (servicoData.clientEmail) {
            const emailClienteBody = {
                to: servicoData.clientEmail,
                subject: `Confirmado: Um profissional aceitou seu serviço de ${servicoData.service}!`,
                html: `
                    <h1>Olá, ${servicoData.clientName}!</h1>
                    <p>Temos uma ótima notícia! O profissional <strong>${professionalData.fullName}</strong> aceitou seu agendamento para o serviço de <strong>${servicoData.service}</strong>.</p>
                    <p>Ele(a) recebeu seus detalhes de contato e deve se comunicar em breve para confirmar tudo.</p>
                    <p><strong>Contato do profissional:</strong> ${professionalData.phone}</p>
                    <p>Para ver os detalhes do seu agendamento, acesse sua conta em nossa plataforma.</p>
                    <br>
                    <p>Atenciosamente,</p>
                    <p>Equipe ServirLar</p>
                `
            };
            
            try {
                await fetch(emailApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailClienteBody),
                });
                 console.log(`E-mail de confirmação para o cliente enviado para ${servicoData.clientEmail}`);
            } catch(emailError) {
                console.error("Erro ao enviar email de notificação para o cliente:", emailError);
            }
        }

        // 3. Enviar notificação por e-mail para o PROFISSIONAL
        if (professionalData.email) {
            const emailProfissionalBody = {
                to: professionalData.email,
                subject: `Serviço atribuído: ${servicoData.service}`,
                html: `
                    <h1>Olá, ${professionalData.fullName}!</h1>
                    <p>Confirmamos o pagamento da taxa para o serviço do cliente <strong>${servicoData.clientName}</strong>. Este serviço agora é seu!</p>
                    <p>Os detalhes completos do cliente e do serviço agora estão disponíveis no seu painel. É importante entrar em contato com o cliente para confirmar os detalhes.</p>
                    <h3>Detalhes do Cliente:</h3>
                    <ul>
                        <li><strong>Nome:</strong> ${servicoData.clientName}</li>
                        <li><strong>Telefone:</strong> ${servicoData.clientPhone}</li>
                        <li><strong>Endereço:</strong> ${servicoData.address}</li>
                    </ul>
                    <p>Bom trabalho!</p>
                    <p>Equipe ServirLar</p>
                `
            };
            try {
                await fetch(emailApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailProfissionalBody),
                });
                console.log(`E-mail de confirmação para o profissional enviado para ${professionalData.email}`);
            } catch (emailError) {
                console.error("Erro ao enviar email de notificação para o profissional:", emailError);
            }
        }
      }
      // ---- FIM DA LÓGICA DE NOTIFICAÇÃO ----

    } catch (error) {
      console.error("Erro ao atualizar o Firestore ou notificar:", error);
      return res.status(500).send("Erro ao processar o pedido.");
    }
  }

  res.status(200).send();
});
