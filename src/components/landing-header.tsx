"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-semibold tracking-wider md:flex">
          <Link href="/pricing" className="transition-colors hover:text-primary/80 text-foreground uppercase">Serviços</Link>
          <Link href="/about" className="transition-colors hover:text-primary/80 text-foreground uppercase">Sobre</Link>
          <Link href="/testimonials" className="transition-colors hover:text-primary/80 text-foreground uppercase">Depoimentos</Link>
          <Link href="/contact" className="transition-colors hover:text-primary/80 text-foreground uppercase">Contato</Link>
        </nav>
        <div className="flex items-center justify-end space-x-2">
           <Button asChild variant="ghost" className="uppercase">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase">
            <Link href="/register">Cadastre-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
