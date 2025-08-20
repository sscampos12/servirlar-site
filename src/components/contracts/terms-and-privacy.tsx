
import { Separator } from "@/components/ui/separator"

export function TermsAndPrivacy() {
    return (
      <div className="space-y-6 text-sm text-muted-foreground">
        <section id="terms">
              <h4 className="font-headline text-lg font-semibold text-foreground mb-4">Termos de Uso da Plataforma – Ajuda em Casa</h4>
              <p className="text-xs mb-4">Última atualização: 20 de agosto de 2025</p>
              <div className="space-y-4">
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">1. Objeto</h5>
                  <p>A plataforma Ajuda em Casa atua exclusivamente como intermediadora, conectando clientes a prestadores de serviços domésticos autônomos.</p>
                </div>
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">2. Natureza da Relação</h5>
                  <p>Não há qualquer vínculo empregatício, subordinação ou habitualidade entre a plataforma e os prestadores de serviço.</p>
                </div>
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">3. Responsabilidade do Prestador</h5>
                    <p>O prestador é integralmente responsável por:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Veracidade das informações fornecidas;</li>
                        <li>Qualidade e execução dos serviços contratados;</li>
                        <li>Cumprimento de obrigações legais, trabalhistas, previdenciárias e tributárias.</li>
                    </ul>
                </div>
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">4. Isenção de Responsabilidade da Plataforma</h5>
                    <p>A plataforma não se responsabiliza por:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Danos, acidentes, furtos ou prejuízos causados pelo prestador;</li>
                        <li>Atos ilícitos praticados por prestadores ou clientes;</li>
                        <li>Perdas ou indisponibilidades decorrentes de caso fortuito ou força maior.</li>
                    </ul>
                </div>
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">5. Obrigações da Plataforma</h5>
                   <p>A Ajuda em Casa compromete-se a:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Disponibilizar sistema de agendamento;</li>
                        <li>Processar pagamentos de forma segura e transparente;</li>
                        <li>Proteger os dados dos usuários, conforme LGPD.</li>
                    </ul>
                </div>
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">6. Rescisão</h5>
                  <p>O usuário poderá encerrar sua conta a qualquer momento. A plataforma poderá rescindir o acesso mediante notificação, sem prejuízo de serviços já agendados.</p>
                </div>
                <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">7. Alterações</h5>
                  <p>Estes Termos poderão ser modificados a qualquer momento. O uso contínuo da plataforma após alterações implica aceite automático.</p>
                </div>
                 <div>
                  <h5 className="font-headline text-base font-semibold text-foreground mb-1">8. Foro</h5>
                  <p>Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.</p>
                </div>
              </div>
        </section>

        <Separator />

        <section id="privacy">
              <h4 className="font-headline text-lg font-semibold text-foreground mb-4">Política de Privacidade – Ajuda em Casa</h4>
               <p className="text-xs mb-4">Última atualização: 20 de agosto de 2025</p>
              <div className="space-y-4">
                  <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">1. Coleta de Dados</h5>
                      <p>Coletamos dados cadastrais (nome, e-mail, telefone, endereço, CPF), financeiros (pagamentos) e técnicos (IP, cookies).</p>
                  </div>
                  <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">2. Finalidade</h5>
                      <p>Os dados são usados para:</p>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                            <li>Criar e gerenciar contas;</li>
                            <li>Intermediar serviços e processar pagamentos;</li>
                            <li>Cumprir obrigações legais e prevenir fraudes.</li>
                        </ul>
                  </div>
                   <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">3. Compartilhamento</h5>
                      <p>Os dados poderão ser compartilhados com prestadores de serviço, instituições financeiras e autoridades competentes, quando exigido por lei.</p>
                  </div>
                   <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">4. Retenção e Segurança</h5>
                      <p>Os dados são mantidos apenas pelo tempo necessário e protegidos por medidas de segurança técnicas e administrativas.</p>
                  </div>
                   <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">5. Direitos do Usuário (LGPD)</h5>
                      <p>Você pode solicitar a qualquer momento: acesso, correção, exclusão ou portabilidade dos seus dados. Contato: <a href="mailto:privacidade@ajudaemcasa.com.br" className="text-primary underline">privacidade@ajudaemcasa.com.br</a>.</p>
                  </div>
                   <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">6. Cookies</h5>
                      <p>Utilizamos cookies para melhorar sua experiência. Você pode desativá-los no navegador.</p>
                  </div>
                   <div>
                      <h5 className="font-headline text-base font-semibold text-foreground mb-1">7. Alterações</h5>
                      <p>A Política poderá ser alterada a qualquer momento. O uso contínuo da plataforma implica concordância.</p>
                  </div>
              </div>
        </section>
      </div>
    );
}
