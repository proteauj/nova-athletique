import PageShell from '@/components/PageShell';

export default function Page() {
  return (
    <PageShell title="Contacts" intro="Téléphones et point de contact de départ pour le nouveau site.">
      <div className="grid-3">
        <div className="info-card">
          <h3>Téléphone</h3>
          <p className="muted">514 796-3308</p>
        </div>
        <div className="info-card">
          <h3>Téléphone</h3>
          <p className="muted">514-978-3661</p>
        </div>
        <div className="info-card">
          <h3>Adresse</h3>
          <p className="muted">48, rue Moreau<br />Saint-Jean-sur-Richelieu</p>
        </div>
      </div>
    </PageShell>
  );
}
