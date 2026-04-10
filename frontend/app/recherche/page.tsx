'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const pages = [
  { title: 'Accueil', href: '/', keywords: ['accueil', 'nova', 'centre', 'remise en forme'] },
  { title: 'Essai gratuit', href: '/reservation/calendrier?mode=essai', keywords: ['essai', 'gratuit'] },
  { title: 'Équipe', href: '/accueil/equipe', keywords: ['équipe', 'coach', 'dominique', 'jennifer', 'tom'] },
  { title: 'Heures', href: '/accueil/heures', keywords: ['heures', 'horaire ouverture'] },
  { title: 'Adresse', href: '/accueil/adresse', keywords: ['adresse', 'saint-jean', 'moreau'] },
  { title: 'Contacts', href: '/accueil/contacts', keywords: ['contact', 'téléphone', 'courriel'] },
  { title: 'Horaire', href: '/reservation/calendrier', keywords: ['horaire', 'calendrier', 'cours'] },
  { title: 'Historique', href: '/reservation/historique', keywords: ['historique', 'réservation'] },
  { title: 'Programme', href: '/mon-compte/programme', keywords: ['programme', 'entrainement'] },
  { title: 'Abonnement', href: '/mon-compte/abonnement', keywords: ['abonnement', 'forfait'] },
  { title: 'Services groupe', href: '/services/groupe', keywords: ['groupe', 'cours groupe'] },
  { title: 'Services privé', href: '/services/prive', keywords: ['privé', 'coach privé'] },
  { title: 'Services spinning', href: '/services/spinning', keywords: ['spinning', 'vélo'] },
  { title: 'Services corporatif', href: '/services/corporatif', keywords: ['corporatif', 'entreprise'] },
  { title: 'Tarif unitaire', href: '/tarifs/unitaire', keywords: ['unitaire', 'drop in'] },
  { title: 'Tarif mensuel 2x', href: '/tarifs/mensuel-2x', keywords: ['mensuel 2x', '2x'] },
  { title: 'Tarif mensuel 3x', href: '/tarifs/mensuel-3x', keywords: ['mensuel 3x', '3x'] },
  { title: 'Tarif illimité', href: '/tarifs/illimite', keywords: ['illimité', 'mensuel illimité'] },
  { title: 'Contact', href: '/contact', keywords: ['contact', 'joindre', 'réserver'] }
];

export default function RecherchePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return pages.filter((page) => {
      const inTitle = page.title.toLowerCase().includes(q);
      const inKeywords = page.keywords.some((k) => k.toLowerCase().includes(q));
      return inTitle || inKeywords;
    });
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(results[0].href);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Recherche</h1>
          <p className="section-copy">
            Tape un mot-clé pour être redirigée vers la page la plus pertinente.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 16 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex. spinning, jennifer, mensuel 2x..."
              style={{
                width: '100%',
                minHeight: 54,
                borderRadius: 16,
                border: '1px solid rgba(159,223,224,0.18)',
                background: 'var(--surface-2)',
                color: 'var(--text)',
                padding: '0 1rem',
                fontSize: 20
              }}
            />

            <button type="submit" className="button" style={{ width: 'fit-content' }}>
              Rechercher
            </button>
          </form>

          {query && (
            <div style={{ marginTop: 20 }} className="card">
              <h3>Résultats</h3>
              {results.length === 0 ? (
                <p className="section-copy">Aucun résultat.</p>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {results.map((result) => (
                    <button
                      key={result.href}
                      onClick={() => router.push(result.href)}
                      style={{
                        textAlign: 'left',
                        background: 'transparent',
                        border: '1px solid rgba(159,223,224,0.12)',
                        color: 'var(--text)',
                        borderRadius: 14,
                        padding: '0.85rem 1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <strong>{result.title}</strong>
                      <div className="section-copy">{result.href}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}