
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Calendar, Bot, Users, LineChart, Banknote, Briefcase, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const allNavItems = [
    { href: "/dashboard", label: "Painel", icon: Home, roles: ["admin"] },
    { href: "/dashboard/providers", label: "Profissionais", icon: Users, roles: ["admin"] },
    { href: "/dashboard/financial", label: "Financeiro", icon: Banknote, roles: ["admin"] },
    { href: "/dashboard/reports", label: "Relatórios", icon: LineChart, roles: ["admin"] },
    { href: "/dashboard/insights", label: "AI Insights", icon: Bot, badge: "Beta", roles: ["admin"] },
    { href: "/dashboard/services", label: "Marketplace", icon: Briefcase, roles: ["professional"] },
    { href: "/dashboard/clients", label: "Meus Agendamentos", icon: User, roles: ["client"] },
    { href: "/schedule", label: "Agendar Serviço", icon: Calendar, roles: ["client"] },
];

export function SidebarNav() {
  const pathname = usePathname()
  const [role, setRole] = useState<'admin' | 'client' | 'professional' | null>(null);

  useEffect(() => {
    // In a real app, you'd get this from a hook useRole()
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (isAdmin) {
        setRole('admin');
    } else {
        // This is a simplification. A real app would check if the logged in user
        // is in the 'professionals' or 'clients' collection in Firestore.
        // For this prototype, we'll assume a non-admin is a client
        // if they are on a client page, and professional otherwise.
        if (pathname.includes('/clients')) {
            setRole('client');
        } else if (pathname.includes('/services') || pathname.includes('/schedule')) {
            // A professional might also schedule, so let's check profile type
            // For now, let's assume a default role if not admin
            setRole('professional'); 
        }
    }
  }, [pathname]);

  const navItems = allNavItems.filter(item => {
      if (!role) return false; // Don't show anything if role is not determined
      return item.roles.includes(role);
  });
  
  if (!role) {
      // You can return a loader here
      return null;
  }

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
