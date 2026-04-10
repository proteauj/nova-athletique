import PageShell from '@/components/PageShell';

export default function Page() {
  return (
    <PageShell title="Adresse" intro="Coordonnées géographiques de Nova Athlétique.">
      <div className="card">
        <h3>Nova Athlétique</h3>
        <p className="muted">48, rue Moreau<br />Saint-Jean-sur-Richelieu (Québec) J2W 1H9</p>
      </div>
    </PageShell>
  );
}
