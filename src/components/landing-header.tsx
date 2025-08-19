
"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold tracking-wider md:flex">
          <Link href="/pricing" className="transition-colors hover:text-primary/80 text-primary uppercase">Preços e Serviços</Link>
          <Link href="/register/provider" className="transition-colors hover:text-primary/80 text-primary uppercase">Profissionais</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button asChild variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
            <Link href="/register">Cadastre-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
