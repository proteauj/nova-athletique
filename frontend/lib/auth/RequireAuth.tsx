'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const fallbackPath = pathname ?? '/login';
      const currentSearch =
        typeof window !== 'undefined' ? window.location.search : '';
      const redirectTo = `${fallbackPath}${currentSearch}`;

      router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="container section">
        <div className="card">
          <p className="section-copy">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}