// Arquivo: src/app/schedule/page.tsx

"use client"

import withAuth from "@/components/auth/with-auth";
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScheduleLayout } from './layout';
import { useAuth } from '@/hooks/use-auth';
import { ClientScheduleForm } from '@/components/ClientScheduleForm';

// Componente temporário para o formulário de Admin.
// Depois, você pode criar um arquivo AdminScheduleForm.tsx e importá-lo aqui.
const AdminScheduleForm = () => (
  <div className="text-center p-8 bg-blue-100 border-blue-400 border rounded-lg">
    <h2 className="text-2xl font-bold">Página do Administrador</h2>
    <p>O formulário de agendamento manual do admin será implementado aqui.</p>
    <p className="mt-4 text-sm">Por enquanto, apenas o formulário do cliente está funcional.</p>
  </div>
);

const SchedulePage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <ScheduleLayout>
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      </ScheduleLayout>
    );
  }

  if (!user) {
    router.push('/login?redirect=/schedule');
    return null;
  }
  
  return (
    <ScheduleLayout>
        {user.role === 'admin' ? <AdminScheduleForm /> : <ClientScheduleForm user={user} />}
    </ScheduleLayout>
  );
};

export default withAuth(SchedulePage, ['admin', 'client']);
