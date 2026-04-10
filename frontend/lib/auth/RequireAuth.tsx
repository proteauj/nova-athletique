'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const query = searchParams?.toString();
      const safePathname = pathname ?? '/reservation/calendrier';
      const redirectTo = query ? `${safePathname}?${query}` : safePathname;

      router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [isAuthenticated, loading, pathname, router, searchParams]);

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