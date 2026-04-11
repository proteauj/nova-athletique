'use client';

const plans = [
  {
    planId: 'groupe-2x',
    name: 'GROUPE 2X PAR SEMAINE *',
    price: '99,14 $ + taxes',
    type: 'GROUPE',
    isMonthly: true,
    details: [
      '2 cours de groupe par semaine',
      'Progression structurée',
      'Engagement mensuel'
    ]
  },
  {
    planId: 'groupe-illimite',
    name: 'GROUPE ILLIMITÉ *',
    price: '118,98 $ + taxes',
    type: 'GROUPE',
    isMonthly: true,
    details: [
      'Cours de groupe illimités',
      'Idéal pour les entraînements fréquents',
      'Accès complet aux cours réguliers'
    ]
  },
  {
    planId: 'libre-illimite',
    name: 'LIBRE ILLIMITÉ',
    price: '66,10 $ + taxes',
    type: 'INDIVIDUEL',
    isMonthly: false,
    details: [
      'Accès libre aux installations',
      'Entraînement autonome',
      'Flexible'
    ]
  },
  {
    planId: '10-seances',
    name: '10 SÉANCES',
    price: '160,00 $ + taxes',
    type: 'CARTE',
    isMonthly: false,
    details: [
      'Carte de séances flexible',
      'Valide sur plusieurs semaines',
      'Inclut cours spécialisés'
    ]
  },
  {
    planId: '30-seances',
    name: '30 SÉANCES',
    price: '405,00 $ + taxes',
    type: 'CARTE',
    isMonthly: false,
    details: [
      'Meilleure valeur',
      'Utilisation flexible',
      'Inclut cours spécialisés'
    ]
  },
  {
    planId: 'drop-in',
    name: 'DROP IN',
    price: '19,99 $ + taxes',
    type: 'CARTE',
    isMonthly: false,
    details: [
      'Accès ponctuel',
      'Sans engagement',
      'Inclut cours spécialisés'
    ]
  }
];

import { useAuth } from '@/hooks/useAuth';

async function startCheckout(planId: string, clientEmail: string) {
  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planId, clientEmail })
  });

  const data = await res.json();

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  alert(data.error || 'Impossible de lancer Stripe.');
}

export default function AbonnementsPage() {
  const { user, refreshMe } = useAuth();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Tarifs</h1>
          <p className="section-copy">
            Choisissez l’abonnement qui correspond à vos objectifs et votre rythme.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="grid-3">
            {plans.map((plan) => (
              <article key={plan.name} className="plan-card">
                <h3>{plan.name}</h3>
                <p className="plan-price">{plan.price}</p>
                <p className="team-role">{plan.type}</p>

                <ul className="list">
                  {plan.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>

                {plan.isMonthly && (
                  <p
                    style={{
                      fontSize: '13px',
                      marginTop: '8px',
                      opacity: 0.7
                    }}
                  >
                    * Cours spécialisés exclus
                  </p>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="button-outline"
                    onClick={async () => {
                      if (!user?.email) {
                        alert('Vous devez être connecté.');
                        return;
                      }

                      startCheckout(plan.planId, user.email);
                      await refreshMe();
                    }}
                  >
                    Choisir ce tarif
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: '40px', maxWidth: 800 }}>
            <p className="section-copy">
              <strong>* Note :</strong> Les abonnements mensuels (2x, 3x, illimité)
              donnent accès aux cours de groupe réguliers uniquement.
              Les cours spécialisés (Yoga, Spinning, etc.) sont inclus
              uniquement avec les cartes de séances (10, 30, Drop-in).
            </p>
          </div>
        </div>
      </section>
    </>
  );
}