
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from '@/components/login-form';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import Image from 'next/image';

function LoginSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
       <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-4 w-full mt-2" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Acesso à Plataforma</h1>
            <p className="text-balance text-muted-foreground">
              Insira seu e-mail e senha para acessar sua conta
            </p>
          </div>
          <Suspense fallback={<LoginSkeleton />}>
            <LoginForm />
          </Suspense>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://i.postimg.cc/QCkrB3KC/foto-1.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="office living room"
        />
      </div>
    </div>
  )
}
