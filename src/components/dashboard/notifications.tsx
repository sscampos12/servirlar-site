import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "../ui/badge"

const mockNotifications = [
    { id: 1, title: "Agendamento Confirmado", description: "Sua faxina com Maria Aparecida foi confirmada para 10/07." },
    { id: 2, title: "Novo Agendamento Disponível", description: "Um serviço de passadoria está disponível na sua área." },
    { id: 3, title: "Pagamento Recebido", description: "O pagamento de R$ 140,00 foi processado." },
    { id: 4, title: "Lembrete de Serviço", description: "Seu serviço com João da Silva é amanhã." },
];

export function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">{mockNotifications.length}</Badge>
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockNotifications.length > 0 ? (
            mockNotifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 whitespace-normal">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                </DropdownMenuItem>
            ))
        ) : (
            <DropdownMenuItem>
                <p className="text-sm text-muted-foreground">Nenhuma nova notificação.</p>
            </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
