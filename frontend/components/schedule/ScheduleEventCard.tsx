'use client';

import { useEffect, useMemo, useState } from 'react';
import { Coach, ScheduleSlot } from '@/lib/schedule/types';
import BookingRequestForm from '@/components/schedule/BookingRequestForm';
import ActionFeedbackModal from '@/components/ui/ActionFeedbackModal';
import { useAuth } from '@/app/context/useAuth';

type ActiveSubscription = {
  id: string;
  isActive: boolean;
  remainingSessions?: number;
  subscriptionType?: string;
  includesSpecializedCourses?: boolean;
  expiresAt?: string;
};

type Props = {
  slot: ScheduleSlot;
  coach?: Coach;
  isTrialMode?: boolean;
  canReserve?: boolean;
  subscriptionType?: string;
  activeSubscriptions?: ActiveSubscription[];
};

function buildSlotDate(day: number, time: string): Date {
  const now = new Date();
  const currentDay = now.getDay();
  let delta = day - currentDay;

  if (delta < 0) delta += 7;

  const date = new Date(now);
  date.setDate(now.getDate() + delta);

  const [hours, minutes] = time.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

function formatSubscriptionType(value?: string) {
  if (!value) return 'Abonnement';

  switch (value.toLowerCase()) {
    case 'mensuel2x':
    case 'monthly2x':
      return 'Mensuel 2x';
    case 'mensuel3x':
    case 'monthly3x':
      return 'Mensuel 3x';
    case 'mensuelillimite':
    case 'monthlyunlimited':
      return 'Mensuel illimité';
    case 'sessioncard':
      return 'Carte de séances';
    default:
      return value;
  }
}

function formatSubscriptionOptionLabel(subscription: ActiveSubscription) {
  const parts: string[] = [formatSubscriptionType(subscription.subscriptionType)];

  if (typeof subscription.remainingSessions === 'number') {
    parts.push(`${subscription.remainingSessions} séance(s) restante(s)`);
  }

  if (subscription.expiresAt) {
    const expiresAt = new Date(subscription.expiresAt);
    if (!Number.isNaN(expiresAt.getTime())) {
      parts.push(
        `Expire le ${expiresAt.toLocaleDateString('fr-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })}`
      );
    }
  }

  return parts.join(' — ');
}

export default function ScheduleEventCard({
  slot,
  coach,
  isTrialMode = false,
  canReserve = true,
  subscriptionType,
  activeSubscriptions = []
}: Props) {
  const { user, token, refreshMe } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('');

  const isGroupType =
    slot.type === 'group' ||
    slot.type === 'spinning' ||
    slot.type === 'corporate';

  const compatibleSubscriptions = useMemo(() => {
    if (isTrialMode) return [];

    return activeSubscriptions.filter((subscription) => {
      if (!subscription.isActive) return false;

      const type = subscription.subscriptionType?.toLowerCase();

      if (type === 'sessioncard' && (subscription.remainingSessions ?? 0) <= 0) {
        return false;
      }

      if (slot.isSpecialized && !subscription.includesSpecializedCourses) {
        return false;
      }

      return true;
    });
  }, [activeSubscriptions, isTrialMode, slot.isSpecialized]);

  useEffect(() => {
    if (compatibleSubscriptions.length === 1) {
      setSelectedSubscriptionId(compatibleSubscriptions[0].id);
      return;
    }

    setSelectedSubscriptionId('');
  }, [compatibleSubscriptions]);

  const hasSpecializedAccess =
    compatibleSubscriptions.some((x) => x.includesSpecializedCourses);

  const specializedExcluded =
    slot.isSpecialized === true &&
    !hasSpecializedAccess &&
    !isTrialMode;

  const canBook = isTrialMode ? true : compatibleSubscriptions.length > 0;

  const requiresSelection =
    !isTrialMode && compatibleSubscriptions.length > 1;

  const isSelectionValid =
    !requiresSelection || !!selectedSubscriptionId;

  const actionLabel = !canBook
    ? 'M’abonner'
    : 'Réserver';

  const handleGroupBooking = async () => {
    try {
      if (!token || !user) {
        window.location.href = '/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

      const start = buildSlotDate(slot.day, slot.start);
      const end = buildSlotDate(slot.day, slot.end);

      const effectiveSubscriptionId =
        selectedSubscriptionId ||
        (compatibleSubscriptions.length === 1 ? compatibleSubscriptions[0].id : '');

      if (!isTrialMode && !effectiveSubscriptionId) {
        setFeedbackTitle('Choix requis');
        setFeedbackMessage('Choisir un abonnement');
        setFeedbackOpen(true);
        return;
      }

      setIsSubmitting(true);

      const response = await fetch(`${apiUrl}/api/GroupBookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slotId: slot.id,
          subscriptionId: isTrialMode ? null : effectiveSubscriptionId,
          title: slot.title,
          clientId: user.clientId,
          clientName: user.fullName,
          clientEmail: user.email,
          isTrial: isTrialMode,
          startTimeUtc: start.toISOString(),
          endTimeUtc: end.toISOString()
        })
      });

      const contentType = response.headers.get('content-type') ?? '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        if (typeof data === 'object' && data?.code) {
          if (
            data.code === 'SUBSCRIPTION_REQUIRED' ||
            data.code === 'SUBSCRIPTION_EXPIRED' ||
            data.code === 'NO_SESSIONS_LEFT' ||
            data.code === 'SPECIALIZED_NOT_INCLUDED' ||
            data.code === 'PLAN_NOT_ALLOWED' ||
            data.code === 'FREE_TRIAL_ALREADY_USED'
          ) {
            window.location.href = '/abonnements';
            return;
          }

          if (data.code === 'UNAUTHORIZED') {
            window.location.href = '/login';
            return;
          }
        }

        throw new Error(
          typeof data === 'string' ? data : data?.message || 'Impossible de réserver.'
        );
      }

      setFeedbackTitle(isTrialMode ? 'Essai confirmé' : 'Réservation confirmée');

      const remainingText =
        typeof data?.remaining === 'number'
          ? ` Places restantes : ${data.remaining}.`
          : '';

      const sessionsText =
        typeof data?.clientRemainingSessions === 'number'
          ? ` Séances restantes : ${data.clientRemainingSessions}.`
          : '';

      setFeedbackMessage(
        `${data.message ?? 'Votre réservation est confirmée.'}${remainingText}${sessionsText}`
      );
      setFeedbackOpen(true);
      await refreshMe();
    } catch (error) {
      setFeedbackTitle('Erreur');
      setFeedbackMessage(
        error instanceof Error ? error.message : 'Erreur de réservation.'
      );
      setFeedbackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    if (isSubmitting) return;

    if (specializedExcluded) {
      window.location.href = '/abonnements';
      return;
    }

    if (!canBook && !isTrialMode) {
      window.location.href = '/abonnements';
      return;
    }

    if (isGroupType) {
      handleGroupBooking();
      return;
    }

    setShowForm(true);
  };

  const buttonDisabled = isSubmitting || !isSelectionValid;

  return (
    <>
      <div className="horaire-event">
        <strong>{slot.title}</strong>

        {slot.isSpecialized && (
          <span style={{ fontWeight: 700, opacity: 0.85 }}>
            🔒 Cours spécialisé
          </span>
        )}

        {coach && <span>{coach.name}</span>}

        <span>
          {slot.start} - {slot.end}
        </span>

        {typeof slot.reservedCount === 'number' &&
          typeof slot.capacity === 'number' && (
            <span>
              Places restantes : {slot.capacity - slot.reservedCount}/{slot.capacity}
            </span>
          )}

        {!isTrialMode && compatibleSubscriptions.length > 1 && (
          <>
            <select
              value={selectedSubscriptionId}
              onChange={(e) => setSelectedSubscriptionId(e.target.value)}
              style={{ marginTop: 8, width: '100%' }}
            >
              <option value="">Choisir un abonnement</option>
              {compatibleSubscriptions.map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  {formatSubscriptionOptionLabel(subscription)}
                </option>
              ))}
            </select>

            {!selectedSubscriptionId && (
              <span style={{ color: '#ffb3b3', fontSize: 14, marginTop: 4 }}>
                Choisir un abonnement
              </span>
            )}
          </>
        )}

        <button
          type="button"
          className="button-try"
          style={{ marginTop: 8, width: '100%' }}
          onClick={handleClick}
          disabled={buttonDisabled}
        >
          {isSubmitting ? 'Envoi...' : actionLabel}
        </button>
      </div>

      {showForm && coach && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <BookingRequestForm
              coach={coach}
              slot={slot}
              isTrialMode={isTrialMode}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <ActionFeedbackModal
        open={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  display: 'grid',
  placeItems: 'center',
  padding: 16,
  zIndex: 100
};

const modalContentStyle: React.CSSProperties = {
  width: 'min(100%, 640px)'
};