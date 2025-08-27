import { Logo } from "./logo";
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  const LinkItem: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );

  return (
    <footer className="mt-16 border-t bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Main footer content */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
                <Logo className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Plataforma simples e segura para contratar limpeza, organização, babá,
              cuidador de idosos e outros serviços domésticos.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p className="mb-4 text-sm font-semibold tracking-wide text-foreground font-headline">
              Navegação
            </p>
            <div className="flex flex-col gap-2">
              <LinkItem href="/">Início</LinkItem>
              <LinkItem href="/about">Sobre Nós</LinkItem>
              <LinkItem href="/pricing">Serviços</LinkItem>
              <LinkItem href="/testimonials">Depoimentos</LinkItem>
            </div>
          </div>

          {/* Jurídico */}
          <div>
            <p className="mb-4 text-sm font-semibold tracking-wide text-foreground font-headline">
              Aspectos Jurídicos
            </p>
            <div className="flex flex-col gap-2">
              <LinkItem href="/legal">Termos de Serviço</LinkItem>
              <LinkItem href="/legal#privacy">Política de Privacidade</LinkItem>
              <LinkItem href="/admin/login">Acesso Restrito</LinkItem>
            </div>
          </div>

          {/* Contato */}
          <div>
            <p className="mb-4 text-sm font-semibold tracking-wide text-foreground font-headline">
              Contato
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                WhatsApp: <a href="https://wa.me/5521920150039" className="text-foreground hover:underline">(21) 92015-0039</a>
              </p>
              <p>
                E-mail: <a href="mailto:contato@servirlar.com.br" className="text-foreground hover:underline">contato@servirlar.com.br</a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-border" />

        {/* Legal bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ServirLar. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <LinkItem href="/legal">Termos de Serviço</LinkItem>
            <span className="text-muted-foreground/50">|</span>
            <LinkItem href="/legal#privacy">Política de Privacidade</LinkItem>
            <span className="text-muted-foreground/50">|</span>
            <LinkItem href="/faq">FAQ</LinkItem>
          </div>
        </div>
      </div>
    </footer>
  );
}
