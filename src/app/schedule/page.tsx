// Arquivo: src/app/schedule/page.tsx

"use client"

import withAuth from "@/components/auth/with-auth";
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScheduleLayout } from './layout';
import { useAuth } from '@/hooks/use-auth';
import { ClientScheduleForm } from '@/components/ClientScheduleForm';
import { AdminScheduleForm } from "@/components/AdminScheduleForm";

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
