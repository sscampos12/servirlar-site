
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
import { useAuth } from "@/hooks/use-auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import React from "react"

export function DashboardHeader() {
  const { user } = useAuth();
  const [role, setRole] = React.useState<'admin' | 'client' | 'professional' | null>(null);

  React.useEffect(() => {
    const determineRole = async () => {
      if (user) {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (isAdmin) {
          setRole('admin');
          return;
        }

        const profDoc = await getDoc(doc(db, "professionals", user.uid));
        if (profDoc.exists()) {
          setRole('professional');
          return;
        }

        setRole('client');
      }
    };
    determineRole();
  }, [user]);

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
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
            >
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav role={role} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Can add search or other header elements here */}
      </div>
      <Notifications />
      <UserNav />
    </header>
  )
}
