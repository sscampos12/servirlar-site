import { MarketingLayout } from "@/components/marketing-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LegalPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Aspectos Jurídicos e Termos</CardTitle>
            <CardDescription>
              Entenda as regras de utilização da nossa plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground">
            <section>
              <h3 className="font-headline text-2xl font-bold text-foreground mb-2">Termos e Condições de Uso</h3>
              <p className="mb-4">
                Ao utilizar a plataforma, você concorda com os seguintes termos.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>A plataforma atua apenas como <strong>intermediadora</strong>, facilitando o contato entre clientes e prestadores de serviço autônomos.</li>
                <li>A Ajuda em Casa se isenta de qualquer responsabilidade por acidentes, danos ou prejuízos decorrentes dos serviços contratados.</li>
                <li>O prestador assume total responsabilidade pela veracidade das informações cadastradas e pela qualidade dos serviços prestados.</li>
                <li>A plataforma se reserva o direito de alterar estes termos a qualquer momento, sendo o aceite obrigatório para continuar o uso.</li>
                <li><strong>Cláusula de Isenção de Responsabilidade:</strong> "A Ajuda em Casa atua apenas como intermediador entre clientes e prestadores de serviço. Não há vínculo empregatício, subordinação ou responsabilidade direta sobre os serviços prestados. O prestador assume integral responsabilidade por sua atuação e pelos encargos decorrentes."</li>
              </ul>
            </section>

            <div className="border-b" />

            <section>
              <h3 className="font-headline text-2xl font-bold text-foreground mb-2">Contrato de Prestação de Serviços Autônomos</h3>
              <p className="mb-4">
                Este contrato estabelece a natureza autônoma da relação entre o prestador de serviço e o cliente, mediada pela plataforma Ajuda em Casa.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Natureza autônoma:</strong> Não há vínculo empregatício, subordinação ou habitualidade entre a plataforma e os prestadores.</li>
                <li><strong>Responsabilidade do Prestador:</strong> O prestador é o único responsável por todos os encargos tributários, previdenciários e trabalhistas, bem como por seus equipamentos e segurança.</li>
                <li><strong>Obrigações da Plataforma:</strong> A Ajuda em Casa se compromete a disponibilizar as informações de agendamento e processar os pagamentos de forma segura e transparente.</li>
                <li><strong>Cláusula de Rescisão:</strong> Ambas as partes podem rescindir o contrato de uso da plataforma com um aviso prévio de 5 dias.</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  )
}
