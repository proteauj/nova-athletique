'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL est manquante.');
      }

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const contentType = response.headers.get('content-type') ?? '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === 'string'
            ? data
            : data?.message || 'Connexion impossible.'
        );
      }

      await login(data.token, {
        clientId: data.client.id,
        fullName: data.client.fullName,
        email: data.client.email,
        hasActiveSubscription: data.client.hasActiveSubscription,
        remainingSessions: data.client.remainingSessions,
        subscriptionType: data.client.subscriptionType,
        hasUsedFreeTrial: data.client.hasUsedFreeTrial,
        hasSpecializedAccess: data.client.hasSpecializedAccess,
        activeSubscriptions: data.client.activeSubscriptions ?? []
      });

      const redirect = searchParams?.get('redirect') ?? '/reservation/calendrier';
      router.push(redirect);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-content">
      <div className="container">
        <div
          className="card"
          style={{
            maxWidth: 520,
            margin: '0 auto',
            display: 'grid',
            gap: 12
          }}
        >
          <h1>Connexion 123</h1>

          <p className="section-copy">
            Connectez-vous pour réserver vos cours et gérer votre abonnement.
          </p>

          {error && (
            <div
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 12,
                background: 'rgba(255, 90, 90, 0.12)',
                border: '1px solid rgba(255, 90, 90, 0.28)'
              }}
            >
              {error}
            </div>
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Courriel"
            style={fieldStyle}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            style={fieldStyle}
          />

          <button
            className="button"
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </section>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 54,
  borderRadius: 16,
  border: '1px solid rgba(159,223,224,0.18)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  padding: '0 1rem',
  fontSize: 20
};