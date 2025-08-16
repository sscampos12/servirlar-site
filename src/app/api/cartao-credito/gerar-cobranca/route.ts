
import { NextRequest, NextResponse } from 'next/server';
// import EfiPay from 'sdk-node-apis-efi';

// Configuração do ambiente (produção ou homologação)
const isProduction = process.env.NODE_ENV === 'production';

const options = {
  sandbox: !isProduction, // true para homologação, false para produção
  client_id: isProduction 
    ? process.env.EFI_CLIENT_ID_P! 
    : process.env.EFI_CLIENT_ID_H!,
  client_secret: isProduction 
    ? process.env.EFI_CLIENT_SECRET_P! 
    : process.env.EFI_CLIENT_SECRET_H!,
  // Certificado não é necessário para pagamentos com cartão de crédito
};

interface CobrancaCartaoRequest {
  valor: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  numeroCartao: string;
  bandeira: string;
  validade: string; // MM/AAAA
  cvv: string;
  descricao?: string;
}

export async function POST(req: NextRequest) {
    const {
        valor,
        cpf,
        nome,
        email,
        telefone,
        numeroCartao,
        bandeira,
        validade,
        cvv,
        descricao
      }: CobrancaCartaoRequest = await req.json();
    
      // Validação dos dados obrigatórios
      if (!valor || !cpf || !nome || !email || !telefone || !numeroCartao || !bandeira || !validade || !cvv) {
        return NextResponse.json({ 
          error: 'Dados incompletos para gerar a cobrança com cartão de crédito.' 
        }, { status: 400 });
      }
    
      // Validação do valor mínimo
      if (valor < 0.01) {
        return NextResponse.json({ 
          error: 'Valor mínimo é R$ 0,01' 
        }, { status: 400 });
      }
    
      // Separa mês e ano da validade
      const [mes, ano] = validade.split('/');
    
      // Corpo da requisição para a API da Efí
      const body = {
        items: [
          {
            name: descricao || 'Pagamento com Cartão de Crédito',
            value: Math.round(valor * 100), // Valor em centavos
            amount: 1,
          },
        ],
        payment: {
          credit_card: {
            installments: 1, // Número de parcelas (ajuste conforme sua necessidade)
            billing_address: {
              street: 'Rua Exemplo',
              number: '123',
              neighborhood: 'Bairro Exemplo',
              zipcode: '00000-000',
              city: 'Cidade Exemplo',
              state: 'SP',
            },
            customer: {
              name: nome,
              email: email,
              cpf: cpf.replace(/\D/g, ''),
              phone_number: telefone.replace(/\D/g, ''),
            },
            card: {
                card_number: numeroCartao.replace(/\D/g, ''),
                brand: bandeira, // Ex: 'visa', 'mastercard'
                expiration_month: mes,
                expiration_year: ano,
                cvv: cvv,
            }
          },
        },
      };

    try {
        // const efipay = new EfiPay(options);
        // const cardResponse = await efipay.createCharge({}, body);
        const cardResponse = {
            "code": 200,
            "data": {
              "charge_id": 12345,
              "total": valor * 100,
              "status": "waiting",
              "payment": "credit_card"
            }
        };


        console.log('Cobrança com Cartão de Crédito criada:', cardResponse);

        return NextResponse.json({
            success: true,
            data: cardResponse,
        });

    } catch (error: any) {
        console.error('Erro ao gerar cobrança com Cartão de Crédito:', error);
        
        return NextResponse.json({ 
            success: false,
            error: error?.message || 'Erro interno do servidor',
            details: error?.response?.data || null
        }, { status: 500 });
    }
}
