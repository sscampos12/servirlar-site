
import { Suspense } from 'react';
import { MarketingLayout } from "@/components/marketing-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from '@/components/login-form';
import { Skeleton } from '@/components/ui/skeleton';

function LoginSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-full mt-2" />
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
    <MarketingLayout>
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Acesso do Cliente e Profissional</CardTitle>
            <CardDescription>
              Acesse sua conta para agendar ou ofertar serviços.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoginSkeleton />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  )
}
