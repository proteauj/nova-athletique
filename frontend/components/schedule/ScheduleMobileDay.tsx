'use client';

import { useMemo, useRef, useState } from 'react';
import ScheduleEventCard from '@/components/schedule/ScheduleEventCard';
import { Coach, ScheduleSlot } from '@/lib/schedule/types';
import {
  DAYS,
  getSlotsForDay,
  getUpcomingSlotsForToday
} from '@/lib/schedule/utils';

type Props = {
  slots: ScheduleSlot[];
  coaches: Coach[];
  isTrialMode?: boolean;
  canReserve?: boolean;
  subscriptionType?: string;
};

export default function ScheduleMobileDay({
  slots,
  coaches,
  isTrialMode = false,
  canReserve = true,
  subscriptionType
}: Props) {
  const today = new Date().getDay();
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const [mobileDay, setMobileDay] = useState(today);
  const touchStartX = useRef<number | null>(null);

  const visibleSlots = useMemo(() => {
    if (mobileDay === today) {
      return getUpcomingSlotsForToday(slots, today, nowMinutes);
    }
    return getSlotsForDay(slots, mobileDay);
  }, [slots, mobileDay, today, nowMinutes]);

  const nextDay = () => setMobileDay((prev) => (prev === 6 ? 0 : prev + 1));
  const prevDay = () => setMobileDay((prev) => (prev === 0 ? 6 : prev - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -40) nextDay();
    if (delta > 40) prevDay();
    touchStartX.current = null;
  };

  return (
    <div
      className="horaire-mobile"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="horaire-mobile-head">
        <button type="button" className="horaire-arrow" onClick={prevDay}>
          ←
        </button>
        <h3>{DAYS[mobileDay]}</h3>
        <button type="button" className="horaire-arrow" onClick={nextDay}>
          →
        </button>
      </div>

      <div className="card">
        {visibleSlots.length === 0 ? (
          <p className="section-copy">Aucun cours restant pour cette journée.</p>
        ) : (
          <div className="horaire-mobile-list">
            {visibleSlots.map((slot) => {
              const coach = coaches.find((c) => c.id === slot.coachId);

              return (
                <ScheduleEventCard
                  key={slot.id}
                  slot={slot}
                  coach={coach}
                  isTrialMode={isTrialMode}
                  canReserve={canReserve}
                  subscriptionType={subscriptionType}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}