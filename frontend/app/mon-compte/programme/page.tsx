'use client';

import PageShell from '@/components/PageShell';
import RequireAuth from '@/lib/auth/RequireAuth';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const { user, loading } = useAuth();

  return (
    <RequireAuth>
      <PageShell
        title="Mon programme"
        intro="Votre programme personnalisé sera affiché ici lorsqu’il sera branché au backend."
      >
        {loading ? (
          <div className="plan-card">
            <p className="muted">Chargement...</p>
          </div>
        ) : (
          <div className="plan-card" style={{ display: 'grid', gap: 12 }}>
            <h3>Programme à venir</h3>

            <p className="muted">
              Cette section est prête côté interface, mais aucun endpoint ne
              retourne encore les données du programme personnalisé.
            </p>

            {user && (
              <div style={infoGridStyle}>
                <InfoRow label="Client" value={user.fullName} />
                <InfoRow
                  label="Abonnement actuel"
                  value={formatSubscriptionType(user.subscriptionType)}
                />
                <InfoRow
                  label="Séances restantes"
                  value={String(user.remainingSessions ?? 0)}
                />
              </div>
            )}
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