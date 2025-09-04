// Arquivo: src/app/dashboard/providers/profile/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ProviderProfileForm } from '@/components/provider-profile-form';

// Componente de fallback para o Suspense
function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
}

export default function CompleteProviderProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
        <ProviderProfileForm />
    </Suspense>
  );
}
