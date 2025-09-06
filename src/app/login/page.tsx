
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from '@/components/login-form';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <Image 
                src="https://i.postimg.cc/mD4p2yDs/logo-oficial-2.png"
                alt="ServirLar Logo"
                width={180}
                height={40}
              />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-headline">Bem-vindo de volta!</h2>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Suspense fallback={<LoginSkeleton />}>
                <LoginForm />
            </Suspense>

            <div className="text-center space-y-2 mt-4">
              <p className="text-sm">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
