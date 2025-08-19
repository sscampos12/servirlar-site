import { MarketingLayout } from "@/components/marketing-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LegalPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Termos e Condições de Uso</CardTitle>
            <CardDescription>
              Ao utilizar a plataforma Ajuda em Casa, o usuário concorda com os seguintes termos:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            
            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Intermediação</h3>
              <p>A plataforma atua exclusivamente como intermediadora, facilitando a conexão entre clientes e prestadores de serviços autônomos.</p>
            </section>

            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Isenção de Responsabilidade</h3>
              <p>A Ajuda em Casa não se responsabiliza por quaisquer danos, acidentes ou prejuízos decorrentes da execução dos serviços, sendo o prestador integralmente responsável por sua atuação.</p>
            </section>

            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Responsabilidade do Prestador</h3>
              <p>O prestador é responsável pela veracidade das informações fornecidas, pela qualidade dos serviços prestados e pelo cumprimento de todas as obrigações legais, trabalhistas, previdenciárias e tributárias.</p>
            </section>

            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Obrigações da Plataforma</h3>
              <p>A Ajuda em Casa compromete-se a disponibilizar informações de agendamento e processar pagamentos de forma segura e transparente.</p>
            </section>

            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Natureza Autônoma</h3>
              <p>Não há qualquer vínculo empregatício, subordinação ou habitualidade entre a plataforma e os prestadores de serviço.</p>
            </section>

            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Rescisão</h3>
              <p>Ambas as partes podem rescindir o contrato de uso da plataforma mediante aviso prévio de 5 dias, sem prejuízo da conclusão de serviços já agendados.</p>
            </section>

            <section>
              <h3 className="font-headline text-xl font-bold text-foreground mb-2">Alterações</h3>
              <p>Estes Termos poderão ser modificados a qualquer momento, sendo o aceite obrigatório para a continuidade do uso da plataforma.</p>
            </section>

          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  )
}
