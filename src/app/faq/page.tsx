import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { MarketingLayout } from "@/components/marketing-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  
export default function FAQPage() {
    const faqs = [
        {
            question: "O que é a ServirLar?",
            answer: "É uma plataforma que conecta clientes a prestadores de serviços domésticos autônomos, atuando apenas como intermediário e facilitador de agendamentos e pagamentos."
        },
        {
            question: "A ServirLar contrata os prestadores de serviço?",
            answer: "Não. Todos os profissionais cadastrados na plataforma são autônomos e independentes. A ServirLar não possui vínculo empregatício com nenhum prestador."
        },
        {
            question: "Como funciona o pagamento?",
            answer: "O pagamento é feito de forma segura através da nossa plataforma no momento do agendamento, utilizando cartão de crédito ou PIN. O valor é repassado ao profissional após a confirmação da realização do serviço."
        },
        {
            question: "Posso cancelar um serviço agendado?",
            answer: "Sim. Para receber o reembolso integral, o cancelamento deve ser feito com no mínimo 24 horas de antecedência do horário agendado."
        },
        {
            question: "Quem é responsável em caso de danos ou acidentes?",
            answer: "Conforme nossos termos de serviço, o prestador autônomo é o único responsável por quaisquer danos, acidentes ou prejuízos que possam ocorrer durante a prestação do serviço."
        },
        {
            question: "Meus dados estão seguros na plataforma?",
            answer: "Sim. Levamos a segurança e a privacidade muito a sério. Seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD) e utilizados apenas para a finalidade do serviço."
        }
    ]

    return (
        <MarketingLayout>
            <div className="container mx-auto py-12 px-4">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Perguntas Frequentes (FAQ)</CardTitle>
                        <CardDescription>
                            Tire suas dúvidas sobre o funcionamento da nossa plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="font-headline">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </MarketingLayout>
    )
}
