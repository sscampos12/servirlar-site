"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dailyData = [
  { date: "Seg", revenue: 250, appointments: 5 },
  { date: "Ter", revenue: 300, appointments: 7 },
  { date: "Qua", revenue: 200, appointments: 4 },
  { date: "Qui", revenue: 450, appointments: 9 },
  { date: "Sex", revenue: 600, appointments: 12 },
  { date: "Sáb", revenue: 800, appointments: 15 },
  { date: "Dom", revenue: 350, appointments: 6 },
];

const weeklyData = [
  { week: "Semana 1", revenue: 2950, appointments: 58 },
  { week: "Semana 2", revenue: 3200, appointments: 65 },
  { week: "Semana 3", revenue: 3500, appointments: 70 },
  { week: "Semana 4", revenue: 3100, appointments: 62 },
];

const monthlyData = [
  { month: "Jan", revenue: 12750, appointments: 255 },
  { month: "Fev", revenue: 13500, appointments: 270 },
  { month: "Mar", revenue: 14200, appointments: 284 },
  { month: "Abr", revenue: 13900, appointments: 278 },
  { month: "Mai", revenue: 15100, appointments: 302 },
];

const chartConfig = {
  revenue: {
    label: "Receita (R$)",
    color: "hsl(var(--chart-1))",
  },
  appointments: {
    label: "Agendamentos",
    color: "hsl(var(--chart-2))",
  },
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Relatórios Gerenciais
        </h1>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Diário</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <ReportChart title="Relatório Diário" data={dailyData} dataKey="date" />
        </TabsContent>
        <TabsContent value="weekly">
          <ReportChart title="Relatório Semanal" data={weeklyData} dataKey="week" />
        </TabsContent>
        <TabsContent value="monthly">
          <ReportChart title="Relatório Mensal" data={monthlyData} dataKey="month" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportChart({ title, data, dataKey }: { title: string, data: any[], dataKey: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>
          Visualize a receita e o número de agendamentos.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div>
          <h3 className="font-semibold mb-4">Receita</h3>
           <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={dataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
               <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Agendamentos</h3>
           <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <RechartsLineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={dataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line dataKey="appointments" type="monotone" stroke="var(--color-appointments)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
