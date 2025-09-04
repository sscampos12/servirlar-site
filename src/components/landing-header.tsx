"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-10 w-auto" />
        </Link>
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
