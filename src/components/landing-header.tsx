
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-4">
             {showBackButton && (
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Button>
            )}
          <div className="mr-auto flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
        </div>
        <nav className="hidden space-x-6 text-sm font-medium md:flex ml-auto">
          <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground uppercase">PREÇOS E SERVIÇOS</Link>
          <Link href="/register/provider" className="transition-colors hover:text-foreground/80 text-foreground uppercase">PROFISSIONAIS</Link>
          <Link href="/faq" className="transition-colors hover:text-foreground/80 text-foreground uppercase">FAQ</Link>
          <Link href="/legal" className="transition-colors hover:text-foreground/80 text-foreground uppercase">LEGAL</Link>
        </nav>
        <div className="flex items-center justify-end space-x-4 ml-6">
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
