import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Profissionais de confiança, na hora que você precisa. Seu lar em boas mãos.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h4 className="font-semibold mb-3">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">Sobre nós</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Carreiras</Link></li>
                <li><Link href="/press" className="hover:text-foreground">Imprensa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal" className="hover:text-foreground">Termos de Serviço</Link></li>
                <li><Link href="/legal" className="hover:text-foreground">Política de Privacidade</Link></li>
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="/admin/login" className="hover:text-foreground">Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lar Seguro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
