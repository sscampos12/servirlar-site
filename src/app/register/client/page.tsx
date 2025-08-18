
import { Suspense } from 'react';
import { MarketingLayout } from "@/components/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { ClientRegistrationForm } from '@/components/register-client-form';

function RegistrationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
       <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  )
}


export default function ClientRegistrationPage() {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Crie sua Conta</CardTitle>
            <CardDescription>
              Cadastre-se para encontrar os melhores profissionais para o seu lar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RegistrationSkeleton />}>
              <ClientRegistrationForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
