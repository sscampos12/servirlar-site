
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);

admin.initializeApp();
const db = admin.firestore();

/**
 * Cria uma sessão de checkout no Stripe para o profissional pagar a taxa.
 * É chamada pelo frontend quando o profissional clica em "Pagar Taxa".
 */
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Verifica se o usuário está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Você precisa estar logado para pagar."
    );
  }

  const { servicoId } = data;
  const profissionalId = context.auth.uid;

  // URLs para onde o Stripe redirecionará após o pagamento
  // SUBSTITUA 'ajudaemcasa.vercel.app' pelo seu domínio final quando tiver um.
  const successUrl = `https://ajudaemcasa.vercel.app/servico/${servicoId}?pagamento=sucesso`;
  const cancelUrl = `https://ajudaemcasa.vercel.app/servico/${servicoId}?pagamento=cancelado`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"], // Adicione 'boleto' para pagamentos no Brasil
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          // ID do Preço que você criou no painel do Stripe
          // SUBSTITUA ESTE ID PELO SEU ID DE PREÇO REAL DO STRIPE
          price: "price_1PjCgqDEQaroqD4wLpQdFzYq", 
          quantity: 1,
        },
      ],
      // Adiciona metadados para sabermos qual serviço está sendo pago
      metadata: {
        servicoId: servicoId,
        profissionalId: profissionalId,
      },
    });

    // Salva o ID da sessão no documento do serviço para referência
    await db.collection("servicos").doc(servicoId).update({
      "taxa.checkoutSessionId": session.id,
    });

    return { id: session.id };
  } catch (error) {
    console.error("Erro ao criar checkout do Stripe:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Não foi possível criar a sessão de pagamento."
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

    // Atualiza o documento do serviço no Firestore para liberar o acesso
    try {
      await db.collection("servicos").doc(servicoId).update({
        "taxa.statusPagamento": "PAGO",
        "taxa.profissionalId": profissionalId, // Garante que o ID do profissional está salvo
      });
      console.log(`Pagamento para o serviço ${servicoId} foi bem-sucedido!`);
    } catch (error) {
      console.error("Erro ao atualizar o Firestore:", error);
      return res.status(500).send("Erro ao processar o pedido.");
    }
  }

  res.status(200).send();
});
