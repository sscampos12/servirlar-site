export function ClientContract() {
    return (
      <div className="space-y-4 text-sm text-muted-foreground">
        <h3 className="text-lg font-semibold text-foreground font-headline">Contrato/Recibo de Serviço Doméstico</h3>
        <p>Este documento formaliza o agendamento do serviço e serve como recibo do pagamento.</p>
        
        <div>
          <h4 className="font-semibold text-foreground">1. Intermediação</h4>
          <p>A Ajuda em Casa atua apenas como intermediadora. Não há vínculo empregatício com o prestador de serviço.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">2. Responsabilidade do Prestador</h4>
          <p>O prestador é responsável exclusivo pela execução do serviço, incluindo qualquer dano, acidente ou prejuízo. A plataforma se isenta de qualquer responsabilidade por atos ou omissões do prestador.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">3. Pagamento e Confirmação</h4>
          <p>O pagamento é realizado via plataforma no momento do agendamento. O serviço só será confirmado após o pagamento, que garante a sua reserva.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">4. Cancelamento e Reembolso</h4>
          <p>O cancelamento do serviço deve ser feito com um aviso mínimo de 24 horas de antecedência para que o reembolso seja processado conforme a nossa política.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">5. Condições da Residência</h4>
          <p>O cliente deve garantir um ambiente seguro e adequado para que o serviço seja executado sem riscos ao prestador.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">6. Força Maior</h4>
          <p>A Plataforma não se responsabiliza por eventos imprevistos que impeçam a realização do serviço.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">7. Confidencialidade e LGPD</h4>
          <p>Suas informações pessoais são usadas apenas para a execução do serviço, conforme a Lei Geral de Proteção de Dados (LGPD). A Plataforma garante o sigilo e a segurança dos seus dados.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">8. Avaliação do Serviço</h4>
          <p>O sistema de avaliação serve para classificar a qualidade do serviço, mas não altera as responsabilidades legais do prestador.</p>
        </div>
      </div>
    );
  }
