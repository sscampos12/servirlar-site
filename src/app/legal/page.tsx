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
              Ao utilizar a plataforma Ajuda em Casa, o usuário concorda com os seguintes termos e políticas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground">
            
            <section id="terms">
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Termos e Condições de Uso</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Intermediação</h3>
                  <p>A plataforma atua exclusivamente como intermediadora, facilitando a conexão entre clientes e prestadores de serviços autônomos.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Isenção de Responsabilidade</h3>
                  <p>A Ajuda em Casa não se responsabiliza por quaisquer danos, acidentes ou prejuízos decorrentes da execução dos serviços, sendo o prestador integralmente responsável por sua atuação.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Responsabilidade do Prestador</h3>
                  <p>O prestador é responsável pela veracidade das informações fornecidas, pela qualidade dos serviços prestados e pelo cumprimento de todas as obrigações legais, trabalhistas, previdenciárias e tributárias.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Obrigações da Plataforma</h3>
                  <p>A Ajuda em Casa compromete-se a disponibilizar informações de agendamento e processar pagamentos de forma segura e transparente.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Natureza Autônoma</h3>
                  <p>Não há qualquer vínculo empregatício, subordinação ou habitualidade entre a plataforma e os prestadores de serviço.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Rescisão</h3>
                  <p>Ambas as partes podem rescindir o contrato de uso da plataforma mediante aviso prévio de 5 dias, sem prejuízo da conclusão de serviços já agendados.</p>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-1">Alterações</h3>
                  <p>Estes Termos poderão ser modificados a qualquer momento, sendo o aceite obrigatório para a continuidade do uso da plataforma.</p>
                </div>
              </div>
            </section>

            <Separator />

            <section id="privacy">
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Política de Privacidade</h2>
               <p className="text-sm mb-4">Última atualização: 29 de Julho de 2024</p>
              <div className="space-y-4">
                  <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">1. Objetivo</h3>
                      <p>Esta Política define como o <strong>Ajuda em Casa</strong> coleta, utiliza, compartilha e protege os dados pessoais dos usuários, em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD)</strong>. O objetivo é garantir transparência, segurança e respeito aos direitos dos titulares.</p>
                  </div>
                  <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">2. Dados Coletados</h3>
                      <p>Coletamos os seguintes tipos de dados pessoais: cadastrais (nome, e-mail, telefone, endereço, CPF), financeiros (para pagamentos), de uso (históricos de agendamentos) e técnicos (IP, cookies).</p>
                  </div>
                  <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">3. Finalidades de Uso</h3>
                      <p>Os dados são utilizados para criar e gerenciar contas, intermediar serviços, processar pagamentos, enviar notificações, cumprir obrigações legais e prevenir fraudes.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">4. Compartilhamento de Dados</h3>
                      <p>Os dados podem ser compartilhados com prestadores de serviços para a execução do contrato, instituições financeiras para processar pagamentos e autoridades competentes, quando exigido por lei. Seus dados não são vendidos.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">5. Retenção e Segurança dos Dados</h3>
                      <p>Mantemos os dados apenas pelo tempo necessário e adotamos medidas técnicas e administrativas adequadas (criptografia, controle de acesso) para protegê-los.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">6. Direitos dos Titulares</h3>
                      <p>De acordo com a LGPD, você pode acessar, corrigir, atualizar ou solicitar a exclusão de seus dados, além de outros direitos. Para exercê-los, entre em contato através de <a href="mailto:privacidade@ajudaemcasa.com.br" className="text-primary underline">privacidade@ajudaemcasa.com.br</a>.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">7. Cookies</h3>
                      <p>Utilizamos cookies para melhorar a experiência do usuário. Você pode gerenciar ou desativar cookies nas configurações do seu navegador.</p>
                  </div>
                   <div>
                      <h3 className="font-headline text-lg font-semibold text-foreground mb-1">8. Alterações nesta Política</h3>
                      <p>Esta Política pode ser atualizada a qualquer momento. Atualizações serão notificadas através da plataforma.</p>
                  </div>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  )
}
