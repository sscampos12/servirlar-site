
import { Suspense } from 'react';
import { MarketingLayout } from "@/components/marketing-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from '@/components/login-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function LoginSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full mt-2" />
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
            <CardTitle className="font-headline text-2xl">Acesso do Cliente</CardTitle>
            <CardDescription>
              Acesse sua conta para agendar serviços ou ver seu histórico.
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
