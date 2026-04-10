'use client';

import { useAuth } from '@/hooks/useAuth';

export default function HomeLoginPrompt() {
  const { isAuthenticated, loading } = useAuth();

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Connexion client</h2>
          <p className="section-copy" style={{ marginBottom: '1rem' }}>
            Connectez-vous pour réserver vos cours, gérer votre abonnement et consulter votre compte.
          </p>

          <div className="button-row" style={{ justifyContent: 'center' }}>
            <a href="/login" className="button">
              Se connecter
            </a>
            <a href="/tarifs" className="button-outline">
              Voir les tarifs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}