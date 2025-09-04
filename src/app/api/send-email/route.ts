// ARQUIVO: /pages/api/send-email.ts (ou onde seu código estiver)

import { NextRequest, NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';
import { z } from 'zod';

// --- CONFIGURAÇÃO DO BREVO ---
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey, 
    process.env.BREVO_API_KEY!
);
// ----------------------------

// --- ATENÇÃO: ALTERE O REMETENTE PARA SEU DOMÍNIO VERIFICADO ---
const fromEmail = "contato@servirlar.com.br";
const fromName = "ServirLar";
// ----------------------------------------------------------------

const emailSchema = z.object({
  to: z.string().email({ message: "Endereço de e-mail do destinatário inválido." }),
  subject: z.string().min(1, { message: "O assunto não pode estar vazio." }),
  html: z.string().min(1, { message: "O conteúdo HTML não pode estar vazio." }),
});


export async function POST(req: NextRequest) {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: 'Corpo da requisição inválido (não é um JSON válido).' 
        }, { status: 400 });
    }

    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ 
            success: false,
            error: 'Dados inválidos ou incompletos para enviar o e-mail.',
            details: parsed.error.flatten().fieldErrors
        }, { status: 400 });
    }

    const { to, subject, html } = parsed.data;

    // Se a chave não estiver configurada, avisa no console (ótimo para desenvolvimento)
    if (!process.env.BREVO_API_KEY) {
        console.warn('--- MODO DE SIMULAÇÃO (BREVO_API_KEY não configurada no arquivo .env) ---');
        console.log(`Um e-mail teria sido enviado para: ${to}`);
        return NextResponse.json({
            success: true,
            message: `E-mail simulado enviado para ${to}.`,
        });
    }

    // --- LÓGICA DE ENVIO COM BREVO ---
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: fromName, email: fromEmail };
    sendSmtpEmail.to = [{ email: to }];
    // Para enviar cópias, ex: sendSmtpEmail.bcc = [{ email: "copia@meusite.com" }];
    // ------------------------------------

    try {
        // A chamada de API do Brevo é um pouco diferente
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

        return NextResponse.json({
            success: true,
            message: `E-mail enviado com sucesso para ${to}.`,
            data: data.body, // O Brevo retorna o corpo da resposta aqui
        });

    } catch (error: any) {
        console.error('Erro detalhado do Brevo:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Falha no serviço de e-mail.',
            details: error?.response?.body?.message || error.message,
        }, { status: 500 });
    }
}