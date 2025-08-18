
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type Role = "admin" | "client" | "professional";

const protectedRoutes: Record<Role, string[]> = {
    admin: ["/dashboard", "/dashboard/providers", "/dashboard/financial", "/dashboard/reports", "/dashboard/insights", "/dashboard/getting-started"],
    professional: ["/dashboard/services"],
    client: ["/dashboard/clients", "/schedule"],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    const checkUserRole = async () => {
      setIsLoadingRole(true);
      // 1. Check for admin in localStorage (simple check for prototype)
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (isAdmin) {
        setRole('admin');
        return;
      }
      
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
          const userRole = userDocSnap.data().role as Role;
          setRole(userRole);

          // Check if user is trying to access a forbidden route
          const allowedRoutes = protectedRoutes[userRole] || [];
          const isRouteAllowed = allowedRoutes.some(route => pathname.startsWith(route));

          if (!isRouteAllowed) {
              console.warn(`Redirecting user with role '${userRole}' from forbidden route '${pathname}'`);
              const defaultRoute = userRole === 'professional' ? '/dashboard/services' : '/dashboard/clients';
              router.replace(defaultRoute);
          }

      } else {
        // This case should ideally not happen if login/register flow is correct
        console.error("User document not found, logging out.");
        await signOut(auth);
        router.replace('/login?error=user_not_found');
      }
      setIsLoadingRole(false);
    };

    checkUserRole();

  }, [loading, user, pathname, router]);

  const isAuthorizing = loading || isLoadingRole;

  if (isAuthorizing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav role={role} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
