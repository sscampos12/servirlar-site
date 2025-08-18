
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [role, setRole] = useState<'admin' | 'client' | 'professional' | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    const checkUserRole = async () => {
      // 1. Check for admin in localStorage (simple check for prototype)
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (isAdmin) {
        setRole('admin');
        setIsAuthorized(true);
        return;
      }
      
      // 2. Check if user is a professional
      const profDocRef = doc(db, "professionals", user.uid);
      const profDocSnap = await getDoc(profDocRef);
      if (profDocSnap.exists()) {
          setRole('professional');
          if (pathname.startsWith('/dashboard/services') || pathname.startsWith('/dashboard/providers/profile')) {
              setIsAuthorized(true);
          } else {
              router.replace('/dashboard/services');
          }
          return;
      }

      // 3. Default to client
      setRole('client');
      if (pathname.startsWith('/dashboard/clients') || pathname === '/schedule') {
        setIsAuthorized(true);
      } else {
        router.replace('/dashboard/clients');
      }
    };

    checkUserRole();

  }, [loading, user, pathname, router]);

  if (loading || !isAuthorized) {
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
