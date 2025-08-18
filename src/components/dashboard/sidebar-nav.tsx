
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Calendar, Bot, Users, LineChart, Banknote, Briefcase, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const allNavItems = [
    { href: "/dashboard", label: "Painel", icon: Home, roles: ["admin"] },
    { href: "/dashboard/providers", label: "Profissionais", icon: Users, roles: ["admin"] },
    { href: "/dashboard/financial", label: "Financeiro", icon: Banknote, roles: ["admin"] },
    { href: "/dashboard/reports", label: "Relatórios", icon: LineChart, roles: ["admin"] },
    { href: "/dashboard/insights", label: "AI Insights", icon: Bot, badge: "Beta", roles: ["admin"] },
    { href: "/dashboard/services", label: "Marketplace", icon: Briefcase, roles: ["professional"] },
    { href: "/dashboard/clients", label: "Meus Agendamentos", icon: User, roles: ["client"] },
];

export function SidebarNav({ role }: { role: 'admin' | 'client' | 'professional' | null }) {
  const pathname = usePathname()

  if (!role) {
      return null; // Or a loading skeleton
  }

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  // Adiciona o link de agendamento para clientes
  if (role === 'client') {
    navItems.push({ href: "/schedule", label: "Agendar Serviço", icon: Calendar, roles: ["client"] });
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname.startsWith(item.href) && item.href !== "/" && "bg-muted text-primary",
            pathname === item.href && item.href === "/" && "bg-muted text-primary"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.badge && <Badge className="ml-auto flex h-6 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent">{item.badge}</Badge>}
        </Link>
      ))}
    </nav>
  )
}
