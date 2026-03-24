'use client';
import Link from 'next/link';

const menu = [
  {
    label: 'Accueil',
    sub: [
      { label: 'Essai gratuit', href: '/accueil/essai-gratuit' },
      { label: "L'équipe", href: '/accueil/equipe' },
      { label: "Heures d'ouverture", href: '/accueil/heures' },
      { label: 'Adresse', href: '/accueil/adresse' },
      { label: 'Contacts', href: '/accueil/contacts' }
    ]
  },
  {
    label: 'Mon compte',
    sub: [
      { label: 'Abonnement', href: '/mon-compte/abonnement' },
      { label: 'Programme', href: '/mon-compte/programme' }
    ]
  },
  {
    label: 'Réservation',
    sub: [
      { label: 'Calendrier', href: '/reservation/calendrier' },
      { label: 'Historique', href: '/reservation/historique' }
    ]
  },
  {
    label: 'Services',
    sub: [
      { label: 'Groupe', href: '/services/groupe' },
      { label: 'Privé', href: '/services/prive' },
      { label: 'Spinning', href: '/services/spinning' },
      { label: 'Corporatif', href: '/services/corporatif' }
    ]
  },
  {
    label: 'Tarifs',
    sub: [
      { label: 'Unitaire', href: '/tarifs/unitaire' },
      { label: 'Mensuel 2x', href: '/tarifs/mensuel-2x' },
      { label: 'Mensuel 3x', href: '/tarifs/mensuel-3x' },
      { label: 'Mensuel illimité', href: '/tarifs/illimite' }
    ]
  },
  { label: 'Contact', href: '/contact' }
];

export default function Menu() {
  return (
    <nav>
      <ul>
        {menu.map((item) => (
          <li key={item.label}>
            {'sub' in item ? (
              <>
                <span>{item.label}</span>
                <ul>
                  {item.sub.map((sub) => (
                    <li key={sub.label}>
                      <Link href={sub.href}>{sub.label}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
