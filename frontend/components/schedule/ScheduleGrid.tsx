import ScheduleEventCard from '@/components/schedule/ScheduleEventCard';
import { Coach, ScheduleSlot } from '@/lib/schedule/types';
import { DAYS, HOURS } from '@/lib/schedule/utils';

type Props = {
  slots: ScheduleSlot[];
  coaches: Coach[];
  isTrialMode?: boolean;
  canReserve?: boolean;
  subscriptionType?: string;
};

export default function ScheduleGrid({
  slots,
  coaches,
  isTrialMode = false,
  canReserve = true,
  subscriptionType
}: Props) {
  return (
    <div className="horaire-desktop">
      <div className="horaire-grid">
        <div className="horaire-corner" />
        {DAYS.map((day) => (
          <div key={day} className="horaire-day-header">
            {day}
          </div>
        ))}

        {HOURS.map((hour) => (
          <div key={hour} style={{ display: 'contents' }}>
            <div className="horaire-hour-label">{hour}</div>

            {DAYS.map((_, dayIndex) => {
              const slot = slots.find(
                (item) => item.day === dayIndex && item.start === hour
              );
              const coach = coaches.find((c) => c.id === slot?.coachId);

              return (
                <div key={`${dayIndex}-${hour}`} className="horaire-cell">
                  {slot && (
                    <ScheduleEventCard
                      key={slot.id}
                      slot={slot}
                      coach={coach}
                      isTrialMode={isTrialMode}
                      canReserve={canReserve}
                      subscriptionType={subscriptionType}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}