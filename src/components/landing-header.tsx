"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function LandingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center gap-2">
          {!isHomePage && (
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <nav className="hidden space-x-6 text-sm font-medium md:flex">
          <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground uppercase">PREÇOS E SERVIÇOS</Link>
          <Link href="/register/provider" className="transition-colors hover:text-foreground/80 text-foreground uppercase">PARA PROFISSIONAIS</Link>
          <Link href="/faq" className="transition-colors hover:text-foreground/80 text-foreground uppercase">FAQ</Link>
          <Link href="/legal" className="transition-colors hover:text-foreground/80 text-foreground uppercase">LEGAL</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button asChild variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Cadastre-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
