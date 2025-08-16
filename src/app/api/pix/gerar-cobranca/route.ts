
import { NextRequest, NextResponse } from 'next/server';
// import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import path from 'path';

// Configuração do ambiente (produção ou homologação)
const isProduction = process.env.NODE_ENV === 'production';

let certificateContent: string | undefined;
if (isProduction && process.env.EFI_CERT_PRODUCAO) {
  try {
    const certPath = path.resolve(process.cwd(), process.env.EFI_CERT_PRODUCAO);
    if (fs.existsSync(certPath)) {
      certificateContent = fs.readFileSync(certPath, 'utf-8');
    } else {
      console.error(`Certificado de produção não encontrado em: ${certPath}`);
    }
  } catch (error) {
    console.error('Erro ao ler o certificado de produção:', error);
  }
}

const options = {
  sandbox: !isProduction, // true para homologação, false para produção
  client_id: isProduction 
    ? process.env.EFI_CLIENT_ID_P! 
    : process.env.EFI_CLIENT_ID_H!,
  client_secret: isProduction 
    ? process.env.EFI_CLIENT_SECRET_P! 
    : process.env.EFI_CLIENT_SECRET_H!,
  certificate: certificateContent,
};

interface CobrancaPIXRequest {
  valor: number;
  cpf: string;
  nome: string;
  descricao?: string;
}

export async function POST(req: NextRequest) {
    const { valor, cpf, nome, descricao }: CobrancaPIXRequest = await req.json();

    // Validação dos dados obrigatórios
    if (!valor || !cpf || !nome) {
        return NextResponse.json({ 
            error: 'Dados obrigatórios: valor, cpf e nome' 
        }, { status: 400 });
    }

    // Validação do valor mínimo
    if (valor < 0.01) {
        return NextResponse.json({ 
            error: 'Valor mínimo é R$ 0,01' 
        }, { status: 400 });
    }

    const body = {
        calendario: {
            expiracao: 3600, // 1 hora em segundos
        },
        devedor: {
            cpf: cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
            nome: nome,
        },
        valor: {
            original: valor.toFixed(2), // Formato com 2 casas decimais
        },
        chave: process.env.EFI_CHAVE_PIX!, // Sua chave PIX cadastrada na Efí
        solicitacaoPagador: descricao || 'Pagamento via PIX para Ajuda em Casa',
    };

    try {
        // const efipay = new EfiPay(options);
        // const pixResponse = await efipay.pixCreateImmediateCharge([], body);
        
        // const locResponse = await efipay.pixDetailLoc({ id: pixResponse.loc.id });

        const qrCodeBase64 = "iVBORw0KGgoAAAANSUhEUgAAARgAAAGEAQMAAABe30K8AAAABlBMVEX///8AAABVwtN+AAABsklEQVR42uyasW3DMBAA3//Scf3A8BlIJiQghZCHgMIMuLpjpwSXfB/s7a1rrX/y9/v7y3v4fP/P93l/f3//f5/b+1sXAHgQMAgYBAwCBoGjDx4EDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAwCBgEDAKGgAEkGd4GgYGgYNAgYBAw+P6AwAAnbLd+kssq5gAAAABJRU5ErkJggg==";

        return NextResponse.json({
            success: true,
            qrcode: `data:image/png;base64,${qrCodeBase64}`,
            txid: 'TXID_EXEMPLO_PARA_COPIAR_E_COLAR',
        });

    } catch (error: any) {
        console.error('Erro ao gerar cobrança PIX:', error.code, error.data);
        return NextResponse.json({ 
            success: false,
            error: error?.message || 'Erro interno do servidor',
            details: error?.data || null
        }, { status: 500 });
    }
}
