import PageShell from '@/components/PageShell';

export default function Page() {
  return (
    <PageShell title="Heures d’ouverture" intro="Horaire repris du site actuel pour remplir immédiatement la section Accueil.">
      <div className="card">
        <p className="muted">
          Lundi 6:00 – 20:00<br />
          Mardi 6:00 – 19:00<br />
          Mercredi 6:00 – 21:00<br />
          Jeudi 6:00 – 19:00<br />
          Vendredi 6:00 – 18:30<br />
          Samedi 8:00 – 11:30<br />
          Dimanche 8:00 – 11:30
        </p>
      </div>
    </PageShell>
  );
}
