
import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="font-bold text-lg text-primary font-headline">
                Lar Seguro
            </span>
          </Link>
          <nav className="hidden space-x-6 text-sm font-medium md:flex">
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground">Preços e Serviços</Link>
            <Link href="/register/provider" className="transition-colors hover:text-foreground/80 text-foreground">Para Profissionais</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button asChild variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register/client">Cadastre-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
