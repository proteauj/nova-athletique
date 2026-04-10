'use client';

import PageShell from '@/components/PageShell';
import RequireAuth from '@/lib/auth/RequireAuth';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const { user, loading } = useAuth();

  return (
    <RequireAuth>
      <PageShell
        title="Mon abonnement"
        intro="Consultez votre plan actif et vos séances restantes."
      >
        {loading ? (
          <div className="plan-card">
            <p className="muted">Chargement de votre abonnement...</p>
          </div>
        ) : !user ? (
          <div className="plan-card">
            <h3>Information indisponible</h3>
            <p className="muted">Aucune donnée disponible.</p>
          </div>
        ) : (
          <div className="plan-card" style={{ display: 'grid', gap: 14 }}>
            <div>
              <h3>Plan actif</h3>
              <p className="plan-price">{formatSubscriptionType(user.subscriptionType)}</p>
            </div>

            <div style={infoGridStyle}>
              <InfoRow
                label="Statut"
                value={user.hasActiveSubscription ? 'Actif' : 'Inactif'}
              />
              <InfoRow
                label="Séances restantes"
                value={String(user.remainingSessions ?? 0)}
              />
              <InfoRow
                label="Essai gratuit utilisé"
                value={user.hasUsedFreeTrial ? 'Oui' : 'Non'}
              />
              <InfoRow label="Courriel" value={user.email} />
            </div>
          </div>
        )}
      </PageShell>
    </RequireAuth>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

function formatSubscriptionType(value?: string) {
  if (!value) return 'Aucun abonnement';

  switch (value.toLowerCase()) {
    case 'mensuel2x':
      return 'Mensuel 2x';
    case 'mensuelillimite':
      return 'Mensuel illimité';
    case 'sessioncard':
      return 'Carte de séances';
    default:
      return value;
  }
}

const infoGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 8
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  padding: '12px 0',
  borderBottom: '1px solid rgba(255,255,255,0.08)'
};

const labelStyle: React.CSSProperties = {
  opacity: 0.8,
  fontWeight: 600
};

const valueStyle: React.CSSProperties = {
  fontWeight: 700,
  textAlign: 'right'
};