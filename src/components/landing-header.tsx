import Link from "next/link";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-accent" />
            <span className="font-bold">Lar Seguro</span>
          </Link>
          <nav className="hidden space-x-6 text-sm font-medium md:flex">
            <Link href="/#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Serviços</Link>
            <Link href="/register/provider" className="transition-colors hover:text-foreground/80 text-foreground/60">Para Profissionais</Link>
            <Link href="/faq" className="transition-colors hover:text-foreground/80 text-foreground/60">FAQ</Link>
            <Link href="/legal" className="transition-colors hover:text-foreground/80 text-foreground/60">Legal</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
