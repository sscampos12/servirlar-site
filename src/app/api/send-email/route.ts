
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// A chave de API NUNCA deve ser exposta no código.
// Ela é buscada de forma segura das variáveis de ambiente.
const resend = new Resend(process.env.RESEND_API_KEY);

// --- ATENÇÃO ---
// Para testes e desenvolvimento, o Resend permite o uso do remetente 'onboarding@resend.dev'.
// Para produção, você DEVE trocar este valor por um e-mail de um domínio que você
// verificou na sua conta do Resend. Ex: "nao-responda@seusite.com.br"
const fromEmail = "Ajuda em Casa <onboarding@resend.dev>";

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
});


export async function POST(req: NextRequest) {
    const body = await req.json();

    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
         return NextResponse.json({ 
          error: 'Dados inválidos ou incompletos para enviar o e-mail.',
          details: parsed.error.format()
        }, { status: 400 });
    }

    const { to, subject, html } = parsed.data;

    // Se a chave não estiver presente ou estiver vazia, simula o envio.
    if (!process.env.RESEND_API_KEY) {
        console.warn('--- MODO DE SIMULAÇÃO (RESEND_API_KEY não configurada no arquivo .env) ---');
        console.log(`Um e-mail teria sido enviado para: ${to}`);
        console.log(`Assunto: ${subject}`);
        console.log('-------------------------------------------------------------------------');
        return NextResponse.json({
            success: true,
            message: `E-mail simulado enviado para ${to}. Configure a RESEND_API_KEY no arquivo .env para envios reais.`,
            data: { id: `simulated_${new Date().getTime()}` },
        });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Erro ao enviar e-mail com Resend:', error);
            return NextResponse.json({ 
                success: false,
                error: 'Falha no serviço de e-mail.',
                details: error
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `E-mail enviado com sucesso para ${to}.`,
            data: data,
        });

    } catch (error: any) {
        console.error('Erro na API de envio de e-mail:', error);
        
        return NextResponse.json({ 
            success: false,
            error: error?.message || 'Erro interno do servidor ao tentar enviar e-mail.',
        }, { status: 500 });
    }
}
