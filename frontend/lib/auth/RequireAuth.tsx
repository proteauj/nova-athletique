'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  children: ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/connexion');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <section className="page-content">
        <div className="container">
          <div className="card">Chargement...</div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}