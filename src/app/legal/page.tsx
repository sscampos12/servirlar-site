import { MarketingLayout } from "@/components/marketing-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";

export default function LegalPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Termos e Políticas</CardTitle>
            <CardDescription>
              Ao utilizar a plataforma ServirLar, o usuário concorda com os seguintes termos e políticas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground">
            
            <section id="terms">
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Termos de Uso da Plataforma – ServirLar</h2>
              <p className="text-sm mb-4">Última atualização: 20 de agosto de 2025</p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">1. Objeto</h3>
                  <p>A plataforma ServirLar atua exclusivamente como intermediadora, conectando clientes a prestadores de serviços domésticos autônomos.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">2. Natureza da Relação</h3>
                  <p>Não há qualquer vínculo empregatício, subordinação ou habitualidade entre a plataforma e os prestadores de serviço.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">3. Responsabilidade do Prestador</h3>
                    <p>O prestador é integralmente responsável por:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Veracidade das informações fornecidas;</li>
                        <li>Qualidade e execução dos serviços contratados;</li>
                        <li>Cumprimento de obrigações legais, trabalhistas, previdenciárias e tributárias.</li>
                    </ul>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">4. Isenção de Responsabilidade da Plataforma</h3>
                    <p>A plataforma não se responsabiliza por:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Danos, acidentes, furtos ou prejuízos causados pelo prestador;</li>
                        <li>Atos ilícitos praticados por prestadores ou clientes;</li>
                        <li>Perdas ou indisponibilidades decorrentes de caso fortuito ou força maior.</li>
                    </ul>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">5. Obrigações da Plataforma</h3>
                   <p>A ServirLar compromete-se a:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Disponibilizar sistema de agendamento;</li>
                        <li>Processar pagamentos de forma segura e transparente;</li>
                        <li>Proteger os dados dos usuários, conforme LGPD.</li>
                    </ul>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">6. Rescisão</h3>
                  <p>O usuário poderá encerrar sua conta a qualquer momento. A plataforma poderá rescindir o acesso mediante notificação, sem prejuízo de serviços já agendados.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">7. Alterações</h3>
                  <p>Estes Termos poderão ser modificados a qualquer momento. O uso contínuo da plataforma após alterações implica aceite automático.</p>
                </div>
                 <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">8. Foro</h3>
                  <p>Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.</p>
                </div>
              </div>
            </section>

            <Separator />

            <section id="privacy">
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Política de Privacidade – ServirLar</h2>
               <p className="text-sm mb-4">Última atualização: 20 de agosto de 2025</p>
              <div className="space-y-4">
                  <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">1. Coleta de Dados</h3>
                      <p>Coletamos dados cadastrais (nome, e-mail, telefone, endereço, CPF), financeiros (pagamentos) e técnicos (IP, cookies).</p>
                  </div>
                  <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">2. Finalidade</h3>
                      <p>Os dados são usados para:</p>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                            <li>Criar e gerenciar contas;</li>
                            <li>Intermediar serviços e processar pagamentos;</li>
                            <li>Cumprir obrigações legais e prevenir fraudes.</li>
                        </ul>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">3. Compartilhamento</h3>
                      <p>Os dados poderão ser compartilhados com prestadores de serviço, instituições financeiras e autoridades competentes, quando exigido por lei.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">4. Retenção e Segurança</h3>
                      <p>Os dados são mantidos apenas pelo tempo necessário e protegidos por medidas de segurança técnicas e administrativas.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">5. Direitos do Usuário (LGPD)</h3>
                      <p>Você pode solicitar a qualquer momento: acesso, correção, exclusão ou portabilidade dos seus dados. Contato: <a href="mailto:privacidade@servirlar.com.br" className="text-primary underline">privacidade@servirlar.com.br</a>.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">6. Cookies</h3>
                      <p>Utilizamos cookies para melhorar sua experiência. Você pode desativá-los no navegador.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">7. Alterações</h3>
                      <p>A Política poderá ser alterada a qualquer momento. O uso contínuo da plataforma implica concordância.</p>
                  </div>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  )
}
