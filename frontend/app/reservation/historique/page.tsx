import PageShell from '@/components/PageShell';

export default function Page() {
  return (
    <PageShell title="Historique" intro="Emplacement pour l’historique des cours réservés et des présences.">
      <div className="card">
        <p className="muted">Aucun historique pour le moment. Cette page servira quand le système de réservation sera branché.</p>
      </div>
    </PageShell>
  );
}
