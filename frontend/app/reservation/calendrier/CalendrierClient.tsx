'use client';

import { useEffect, useMemo, useState } from 'react';
import ScheduleGrid from '@/components/schedule/ScheduleGrid';
import ScheduleMobileDay from '@/components/schedule/ScheduleMobileDay';
import { Coach, ScheduleSlot } from '@/lib/schedule/types';
import RequireAuth from '@/lib/auth/RequireAuth';
import { useAuth } from '@/hooks/useAuth';

type ActiveSubscription = {
  id: string;
  isActive: boolean;
  remainingSessions?: number;
  subscriptionType?: string;
  includesSpecializedCourses?: boolean;
  expiresAt?: string;
};

type ViewerAccess = {
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  remainingSessions: number;
  subscriptionType?: string;
  activeSubscriptions: ActiveSubscription[];
};

type CalendrierClientProps = {
  mode?: string;
};

export default function CalendrierClient({
  mode,
}: CalendrierClientProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const isTrialMode = useMemo(() => {
    return mode === 'essai';
  }, [mode]);

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

        const [coachesRes, scheduleRes] = await Promise.all([
          fetch(`${apiUrl}/api/coaches`),
          fetch(`${apiUrl}/api/schedule`),
        ]);

        if (!coachesRes.ok || !scheduleRes.ok) {
          throw new Error('Impossible de charger les coachs ou l’horaire.');
        }

        const coachesData: Coach[] = await coachesRes.json();
        const scheduleData: ScheduleSlot[] = await scheduleRes.json();

        setCoaches(coachesData);
        setSlots(scheduleData);
      } catch (error) {
        console.error('Erreur chargement horaire:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const viewerAccess: ViewerAccess = {
    isAuthenticated,
    hasActiveSubscription: !!user?.hasActiveSubscription,
    remainingSessions: user?.remainingSessions ?? 0,
    subscriptionType: user?.subscriptionType,
    activeSubscriptions: user?.activeSubscriptions ?? [],
  };

  const canReserve =
    viewerAccess.isAuthenticated &&
    viewerAccess.activeSubscriptions.some(
      (subscription) =>
        subscription.isActive &&
        (
          (subscription.subscriptionType?.toLowerCase() === 'sessioncard' &&
            (subscription.remainingSessions ?? 0) > 0) ||
          subscription.subscriptionType?.toLowerCase() !== 'sessioncard'
        )
    );

  const visibleSlots = useMemo(() => {
    if (isTrialMode) {
      return slots.filter(
        (slot) => slot.bookingMode === 'group' && slot.isAvailable
      );
    }

    return slots;
  }, [slots, isTrialMode]);

  return (
    <RequireAuth>
      <section className="page-hero">
        <div className="container">
          <h1>{isTrialMode ? 'Réserver un essai gratuit' : 'Horaire'}</h1>
          <p className="section-copy">
            {isTrialMode
              ? 'Choisissez un cours de groupe disponible pour réserver votre essai gratuit.'
              : 'Consultez l’horaire hebdomadaire complet des cours et disponibilités.'}
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {!isTrialMode && !authLoading && !viewerAccess.isAuthenticated && (
            <div className="card" style={{ marginBottom: 20, textAlign: 'center' }}>
              <p className="section-copy" style={{ marginBottom: 16 }}>
                Vous devez être connecté pour réserver.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <a href="/login" className="button">
                  Se connecter
                </a>
                <a href="/abonnements" className="button-outline">
                  Voir les tarifs
                </a>
              </div>
            </div>
          )}

          {!isTrialMode && !authLoading && viewerAccess.isAuthenticated && !canReserve && (
            <div className="card" style={{ marginBottom: 20, textAlign: 'center' }}>
              <p className="section-copy" style={{ marginBottom: 16 }}>
                Vous n’avez pas d’abonnement actif ou de séances disponibles pour réserver.
              </p>
              <a href="/abonnements" className="button">
                M’abonner
              </a>
            </div>
          )}

          {loading || authLoading ? (
            <div className="card">
              <p className="section-copy">Chargement de l’horaire…</p>
            </div>
          ) : visibleSlots.length === 0 ? (
            <div className="card">
              <p className="section-copy">
                {isTrialMode
                  ? 'Aucun cours de groupe disponible pour un essai gratuit pour le moment.'
                  : 'Aucun créneau disponible pour le moment.'}
              </p>
            </div>
          ) : (
            <>
              <ScheduleGrid
                slots={visibleSlots}
                coaches={coaches}
                isTrialMode={isTrialMode}
                canReserve={isTrialMode ? true : canReserve}
                subscriptionType={viewerAccess.subscriptionType}
              />

              <ScheduleMobileDay
                slots={visibleSlots}
                coaches={coaches}
                isTrialMode={isTrialMode}
                canReserve={isTrialMode ? true : canReserve}
                subscriptionType={viewerAccess.subscriptionType}
              />
            </>
          )}
        </div>
      </section>
    </RequireAuth>
  );
}