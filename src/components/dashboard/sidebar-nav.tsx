 "use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Calendar, Bot, User, Users, LineChart, Contact, Banknote, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navItems = [
    { href: "/dashboard", label: "Painel", icon: Home },
    { href: "/schedule", label: "Agendar", icon: Calendar },
    { href: "/dashboard/providers", label: "Profissionais", icon: Users },
    { href: "/dashboard/clients", label: "Clientes", icon: Contact },
    { href: "/dashboard/services", label: "Serviços", icon: Briefcase },
    { href: "/dashboard/reports", label: "Relatórios", icon: LineChart },
    { href: "/dashboard/financial", label: "Financeiro", icon: Banknote },
    { href: "/dashboard/insights", label: "AI Insights", icon: Bot, badge: "Beta" },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname.startsWith(item.href) && (item.href !== "/dashboard" && item.href !== "/schedule") && "bg-muted text-primary",
            pathname === item.href && "bg-muted text-primary"
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
