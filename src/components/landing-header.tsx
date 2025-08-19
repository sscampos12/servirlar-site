"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function LandingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = !['/', '/login', '/register'].includes(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="flex items-center gap-4">
             {showBackButton && (
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Button>
            )}
          <div className="mr-auto flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
        </div>
        <nav className="hidden space-x-8 text-sm font-semibold tracking-wider md:flex ml-auto">
          <Link href="/pricing" className="transition-colors hover:text-primary/80 text-primary uppercase">PREÇOS</Link>
          <Link href="/about" className="transition-colors hover:text-primary/80 text-primary uppercase">SOBRE NÓS</Link>
          <Link href="/faq" className="transition-colors hover:text-primary/80 text-primary uppercase">FAQ</Link>
        </nav>
        <div className="flex items-center justify-end space-x-2 ml-6">
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
