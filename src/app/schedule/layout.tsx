
import { UserNav } from "@/components/dashboard/user-nav";
import { Logo } from "@/components/logo";
import Link from "next/link";
import React from "react";

export function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            >
            <Logo className="h-8 w-auto" />
        </Link>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
                {/* Search can go here */}
            </div>
            <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}

export default ScheduleLayout;
