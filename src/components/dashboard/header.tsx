
"use client";

import Link from "next/link"
import {
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserNav } from "./user-nav"
import { SidebarNav } from "./sidebar-nav"
import { Logo } from "@/components/logo"
import { Notifications } from "./notifications"
import React from "react"
import { Role } from "@/app/dashboard/layout"
import { useRouter } from "next/navigation"


export function DashboardHeader() {
    const [role, setRole] = React.useState<Role | null>('admin');
    const router = useRouter();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
             <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav role={role} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Search bar can go here */}
      </div>
      <Notifications />
      <UserNav />
    </header>
  )
}
