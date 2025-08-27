export function ClientContract() {
    return (
      <div className="space-y-4 text-sm text-muted-foreground">
        <h3 className="text-lg font-semibold text-foreground font-headline">Contrato/Recibo de Serviço Doméstico – Agendamento</h3>
         <p className="text-xs">Última atualização: 20 de agosto de 2025</p>
        <p>Este documento formaliza o agendamento do serviço e o pagamento correspondente. O prestador responsável será definido somente após aceite de um profissional disponível no sistema.</p>
        
        <div>
          <h4 className="font-semibold text-foreground">1. Intermediação</h4>
          <p>A ServirLar atua apenas como intermediadora, não havendo vínculo empregatício com o prestador.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">2. Responsabilidade</h4>
          <p>O prestador será o único responsável pela execução do serviço quando aceitar o agendamento.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">3. Pagamento e Confirmação</h4>
          <p>O pagamento garante a reserva do serviço. A confirmação final depende da aceitação de um prestador disponível.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">4. Cancelamento e Reembolso</h4>
          <p>Cancelamentos devem ser feitos com antecedência mínima de 24 horas. Após este prazo, não haverá reembolso, salvo situações de força maior devidamente comprovadas.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">5. Condições da Residência</h4>
          <p>O cliente deve garantir ambiente seguro e adequado para execução do serviço.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">6. Força Maior</h4>
          <p>A plataforma não se responsabiliza por imprevistos que impeçam a realização do serviço.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">7. Confidencialidade e LGPD</h4>
          <p>As informações pessoais serão usadas apenas para a execução do serviço, conforme a LGPD.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">8. Aceite Digital</h4>
          <p>O aceite eletrônico equivale à assinatura digital válida em lei.</p>
        </div>
      </div>
    );
  }
