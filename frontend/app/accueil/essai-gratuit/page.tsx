import Link from 'next/link';
import PageShell from '@/components/PageShell';

export default function Page() {
  return (
    <PageShell
      title="Essai gratuit"
      intro="Une section de départ pour rediriger la personne vers le parcours d’essai gratuit et présenter clairement l’offre."
    >
      <div className="card">
        <h3>Découvrir Nova Athlétique</h3>
        <p className="muted">
          L’essai gratuit est l’appel à l’action principal du site actuel. Cette page sert de base
          pour remplacer le lien FliiP plus tard tout en gardant la même logique d’acquisition.
        </p>
        <div className="button-row">
          <Link href="/contact" className="button">Demander un essai</Link>
          <Link href="/services/groupe" className="button-outline">Voir les services</Link>
        </div>
      </div>
    </PageShell>
  );
}
