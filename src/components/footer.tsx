
import { Logo } from "./logo";
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  const LinkItem: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );

  return (
    <footer className="mt-16 border-t bg-card text-card-foreground">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Call to action */}
        <div className="my-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-muted/50 p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-headline">
              Precisa de ajuda hoje?
            </h3>
            <p className="text-sm text-muted-foreground">
              Agende um serviço doméstico com profissionais de confiança.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Ver serviços
            </Link>
            <Link
              href="/register/provider"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sou profissional
            </Link>
          </div>
        </div>

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
              <LinkItem href="/faq">FAQ</LinkItem>
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
            </div>
          </div>

          {/* Contato */}
          <div>
            <p className="mb-4 text-sm font-semibold tracking-wide text-foreground font-headline">
              Contato
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                WhatsApp: <a href="https://wa.me/5500000000000" className="text-foreground hover:underline">(00) 00000-0000</a>
              </p>
              <p>
                E-mail: <a href="mailto:suporte@ajudaemcasa.com.br" className="text-foreground hover:underline">suporte@ajudaemcasa.com.br</a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-border" />

        {/* Legal bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Ajuda em Casa. Todos os direitos reservados.
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
