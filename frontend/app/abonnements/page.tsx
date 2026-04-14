'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

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

async function startCheckout(planId: string, clientId: string, clientEmail: string) {
  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      planId,
      clientEmail,
      clientId
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || 'Impossible de lancer Stripe.');
    return;
  }

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  alert('Impossible de lancer Stripe.');
}

export default function AbonnementsPage() {
  const { user, refreshMe } = useAuth();
  const [message, setMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const syncSubscription = async () => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      const cancel = params.get('cancel');

      if (success === '1') {
        setMessage('Paiement confirmé. Mise à jour de votre abonnement...');
        setIsRefreshing(true);

        try {
          await refreshMe();
          setMessage('Paiement confirmé. Votre abonnement a été mis à jour.');
        } catch {
          setMessage('Paiement confirmé, mais la mise à jour de votre abonnement a échoué.');
        } finally {
          setIsRefreshing(false);
        }

        return;
      }

      if (cancel === '1') {
        setMessage('Le paiement a été annulé.');
      }
    };

    syncSubscription();
  }, [refreshMe]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Tarifs</h1>
          <p className="section-copy">
            Choisissez l’abonnement qui correspond à vos objectifs et votre rythme.
          </p>

          {message && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.9rem 1rem',
                borderRadius: 12,
                background: 'rgba(159,223,224,0.12)',
                border: '1px solid rgba(159,223,224,0.28)'
              }}
            >
              {message}
            </div>
          )}

          {!!user?.hasActiveSubscription && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.9rem 1rem',
                borderRadius: 12,
                background: 'rgba(120, 220, 120, 0.12)',
                border: '1px solid rgba(120, 220, 120, 0.28)'
              }}
            >
              <strong>Abonnement actif :</strong>{' '}
              {user.subscriptionType ?? 'Actif'}
              {typeof user.remainingSessions === 'number' &&
              user.subscriptionType?.toLowerCase() === 'sessioncard'
                ? ` — ${user.remainingSessions} séance(s) restante(s)`
                : ''}
            </div>
          )}

          {isRefreshing && (
            <p style={{ marginTop: '0.75rem' }}>
              Synchronisation de votre profil...
            </p>
          )}
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
                      if (!user?.clientId || !user?.email) {
                        alert('Vous devez être connecté.');
                        return;
                      }

                      await startCheckout(plan.planId, user.clientId, user.email);
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