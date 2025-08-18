
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
    admin: ["/dashboard/providers", "/dashboard/financial", "/dashboard/reports", "/dashboard/insights", "/dashboard/getting-started"],
    professional: ["/dashboard/services", "/dashboard/providers/profile", "/chat"],
    client: ["/dashboard/clients", "/schedule", "/chat"],
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
      
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (isAdmin && user.email === "contato@ajudaemcasa.com") {
        setRole('admin');
        setIsLoadingRole(false);
        // Admin-specific redirect logic is handled in the next useEffect
        return; 
      }
      
      const professionalDocRef = doc(db, "professionals", user.uid);
      const professionalDocSnap = await getDoc(professionalDocRef);

      if (professionalDocSnap.exists()) {
          setRole("professional");
      } else {
          const clientDocRef = doc(db, "clients", user.uid);
          const clientDocSnap = await getDoc(clientDocRef);
           if (clientDocSnap.exists()) {
              setRole("client");
           } else {
               console.error("User document not found in clients or professionals, logging out.");
               await signOut(auth);
               localStorage.removeItem("isAdmin"); // Clean up admin flag
               router.replace('/login?error=user_not_found');
               setIsLoadingRole(false);
               return;
           }
      }
      setIsLoadingRole(false);
    };

    checkUserRole();

  }, [loading, user, pathname, router]);

   useEffect(() => {
    if (isLoadingRole || !role || !user) return;
    
    // Redirect logic based on role
    const isDashboardRoot = pathname === '/dashboard' || pathname === '/dashboard/';
    if (isDashboardRoot) {
      if (role === 'admin') router.replace('/dashboard/providers');
      else if (role === 'professional') router.replace('/dashboard/services');
      else if (role === 'client') router.replace('/dashboard/clients');
      return;
    }

    const allowedRoutes = protectedRoutes[role] || [];
    // Allow access to chatId sub-routes
    const isRouteAllowed = allowedRoutes.some(route => pathname.startsWith(route));

    if (!isRouteAllowed) {
        console.warn(`Redirecting user with role '${role}' from forbidden route '${pathname}'`);
        const defaultRoute = role === 'professional' ? '/dashboard/services' : role === 'admin' ? '/dashboard/providers' : '/dashboard/clients';
        router.replace(defaultRoute);
    }
   }, [role, isLoadingRole, user, pathname, router]);


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
