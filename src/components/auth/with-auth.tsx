// ----------------------------------------------------------------
// ORDEM 4: GUARDIÃO DE ROTAS (HIGH-ORDER COMPONENT)
// ----------------------------------------------------------------
// OBJETIVO: Criar um "segurança" que envolve as páginas protegidas.
//           Ele verifica se o usuário está logado e se seu papel
//           (role) tem permissão para ver a página.
// ----------------------------------------------------------------

"use client";

import { useAuth } from '@/hooks/use-auth'; // Importa da ORDEM 2
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/loading-spinner'; // Um componente de spinner simples

// HOC que recebe o Componente da página e os papéis permitidos
const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[]) => {
  const AuthComponent = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Espera a verificação inicial terminar
      if (!loading) {
        // Se não tem usuário, manda para a página de login
        if (!user) {
          router.replace('/login');
          return;
        }

        // Se o papel do usuário não está na lista de permissões, redireciona
        if (!user.role || !allowedRoles.includes(user.role)) {
          alert('Acesso negado. Você não tem permissão para ver esta página.');
          // Redireciona para a página inicial do seu papel
          switch (user.role) {
            case 'admin': router.replace('/dashboard'); break;
            case 'professional': router.replace('/dashboard/profile'); break;
            case 'client': router.replace('/dashboard/my-account'); break;
            default: router.replace('/');
          }
        }
      }
    }, [user, loading, router]);

    // Mostra um spinner enquanto carrega ou se o usuário não tem permissão
    if (loading || !user || !user.role || !allowedRoles.includes(user.role)) {
      return <LoadingSpinner />;
    }

    // Se passou por todas as verificações, mostra a página
    return <WrappedComponent {...props} />;
  };
  
  AuthComponent.displayName = `withAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;


  return AuthComponent;
};

export default withAuth;
