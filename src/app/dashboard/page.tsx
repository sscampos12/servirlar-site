import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { DollarSign, Users, Calendar, Star } from "lucide-react"
  
  export default function DashboardPage() {
    const stats = [
      {
        title: "Receita Mensal",
        value: "R$ 4.523,18",
        description: "+20.1% do mês passado",
        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Clientes Ativos",
        value: "+235",
        description: "+180.1% do mês passado",
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Agendamentos",
        value: "+123",
        description: "+19% do mês passado",
        icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Avaliação Média",
        value: "4.9",
        description: "Média de todas as avaliações",
        icon: <Star className="h-4 w-4 text-muted-foreground" />,
      },
    ]
  
    return (
      <>
        <div className="flex items-center">
            <h1 className="font-headline text-lg font-semibold md:text-2xl">Painel de Controle</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Agendamentos Recentes</CardTitle>
              <CardDescription>
                Visualize e gerencie os próximos serviços.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nenhum agendamento recente para exibir.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Atividade</CardTitle>
              <CardDescription>Resumo das atividades da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="flex items-center gap-4">
                    <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Novo cadastro de profissional</p>
                    <p className="text-sm text-muted-foreground">Maria da Silva se cadastrou.</p>
                    </div>
                    <div className="ml-auto font-medium">1h atrás</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Novo agendamento</p>
                    <p className="text-sm text-muted-foreground">João P. agendou uma faxina.</p>
                    </div>
                    <div className="ml-auto font-medium">3h atrás</div>
                </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }
  