import PageShell from '@/components/PageShell';

export default function Page() {
  return (
    <PageShell title="Cours de groupe" intro="Section de base pour les cours encadrés.">
      <div className="card">
        <p className="muted">
          Le site actuel met de l’avant les cours de groupe et des disciplines comme le spinning,
          le yoga et le pilates dans ses offres d’abonnements.
        </p>
      </div>
    </PageShell>
  );
}
