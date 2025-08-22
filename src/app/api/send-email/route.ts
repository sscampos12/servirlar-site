
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// A chave de API NUNCA deve ser exposta no código.
// Ela é buscada de forma segura das variáveis de ambiente.
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANTE: Troque 'seu-dominio-verificado.com' por um domínio que você verificou na sua conta do Resend.
const fromEmail = "Ajuda em Casa <nao-responda@seu-dominio-verificado.com>";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

export async function POST(req: NextRequest) {
    const { to, subject, html }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
        return NextResponse.json({ 
          error: 'Dados incompletos para enviar o e-mail: é necessário "to", "subject" e "html".' 
        }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY não está configurada nas variáveis de ambiente.');
        // Em vez de falhar, vamos simular o envio se a chave não estiver presente
        // para não quebrar o fluxo em ambientes de desenvolvimento sem chave.
        console.log('--- MODO DE SIMULAÇÃO (RESEND_API_KEY não encontrada) ---');
        console.log(`Para: ${to}`);
        console.log(`Assunto: ${subject}`);
        console.log('-------------------------------------------------------');
        return NextResponse.json({
            success: true,
            message: `E-mail simulado enviado para ${to} pois a RESEND_API_KEY não foi configurada.`,
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
