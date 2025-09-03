// ----------------------------------------------------------------
// ORDEM 3: INTEGRAÇÃO DO PROVEDOR DE AUTENTICAÇÃO
// ----------------------------------------------------------------
// OBJETIVO: Garantir que todos os componentes e páginas da nossa
//           aplicação tenham acesso às informações de autenticação
//           fornecidas pelo AuthProvider.
// ----------------------------------------------------------------
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth'; // Importa da ORDEM 2

const poppins = Poppins({ 
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '900']
});

export const metadata: Metadata = {
  title: 'ServirLar',
  description: 'Conectando você aos melhores profissionais domésticos.',
  icons: {
    icon: 'https://i.postimg.cc/mD4p2yDs/logo-oficial-2.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${poppins.variable}`}>
      <body className={poppins.className}>
        {/* Envolvemos toda a aplicação com o nosso Provedor */}
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
