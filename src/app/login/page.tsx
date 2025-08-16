
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarketingLayout } from "@/components/marketing-layout"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const redirectUrl = searchParams.get('redirect') || '/schedule';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd perform authentication here.
    // For the prototype, we'll just show a success message and redirect.
    toast({
      title: "Login bem-sucedido!",
      description: "Redirecionando para a página de confirmação...",
    });
    router.push(redirectUrl);
  };

  return (
    <MarketingLayout>
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Acesso do Cliente</CardTitle>
            <CardDescription>
              Acesse sua conta para confirmar e pagar seu agendamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Entrar e Pagar
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/register/client" className="underline">
                Cadastre-se como Cliente
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  )
}
