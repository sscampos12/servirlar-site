
"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export type Role = "admin" | "client" | "professional";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                setRole(userDocSnap.data().role as Role);
            } else {
                 const professionalDocRef = doc(db, "professionals", user.uid);
                 const professionalDocSnap = await getDoc(professionalDocRef);
                 if (professionalDocSnap.exists()){
                     setRole("professional");
                 } else {
                     setRole("client");
                 }
            }
        }
    };

    if (!loading) {
        fetchUserRole();
    }
  }, [user, loading]);


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
