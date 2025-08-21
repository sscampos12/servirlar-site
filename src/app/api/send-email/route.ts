
import { NextRequest, NextResponse } from 'next/server';
// Para usar o Resend de verdade, instale-o: npm install resend
// import { Resend } from 'resend';

// A chave de API NUNCA deve ser exposta no código.
// Em um ambiente real, ela viria de variáveis de ambiente seguras.
// const resend = new Resend(process.env.RESEND_API_KEY);
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

    try {
        // --- SIMULAÇÃO DE ENVIO DE E-MAIL ---
        // Em um ambiente real, a chamada à API do Resend estaria aqui:
        /*
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Erro ao enviar e-mail com Resend:', error);
            throw new Error('Falha no serviço de e-mail.');
        }
        */

        // Como estamos simulando, apenas logamos a intenção e retornamos sucesso.
        console.log('--- SIMULANDO ENVIO DE E-MAIL ---');
        console.log(`Para: ${to}`);
        console.log(`Assunto: ${subject}`);
        console.log('-----------------------------------');
        
        // Simula uma resposta de sucesso da API de e-mail.
        const mockResponse = { id: `mock_${new Date().getTime()}` };

        return NextResponse.json({
            success: true,
            message: `E-mail simulado enviado com sucesso para ${to}.`,
            data: mockResponse,
        });

    } catch (error: any) {
        console.error('Erro na API de envio de e-mail:', error);
        
        return NextResponse.json({ 
            success: false,
            error: error?.message || 'Erro interno do servidor ao tentar enviar e-mail.',
        }, { status: 500 });
    }
}
