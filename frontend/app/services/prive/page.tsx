'use client';

import { useEffect, useMemo, useState } from 'react';
import ScheduleGrid from '@/components/schedule/ScheduleGrid';
import ScheduleMobileDay from '@/components/schedule/ScheduleMobileDay';
import { Coach, ScheduleSlot } from '@/lib/schedule/types';
import { filterSlotsByCoach } from '@/lib/schedule/utils';

export default function PrivePage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [coachId, setCoachId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL est manquante.');
        }

        const [coachesRes, scheduleRes] = await Promise.all([
          fetch(`${apiUrl}/api/Coaches`),
          fetch(`${apiUrl}/api/Schedule`)
        ]);

        const coachesData: Coach[] = await coachesRes.json();
        const scheduleData: ScheduleSlot[] = await scheduleRes.json();

        setCoaches(coachesData);
        setSlots(scheduleData);

        if (coachesData.length > 0) {
          setCoachId(coachesData[0].id);
        }
      } catch (error) {
        console.error('Erreur chargement privé:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredSlots = useMemo(() => {
    return filterSlotsByCoach(slots, coachId);
  }, [slots, coachId]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Entraînement privé</h1>
          <p className="section-copy">
            Choisissez un coach pour voir ses disponibilités et réserver une séance.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {loading ? (
            <div className="card">
              <p className="section-copy">Chargement des coachs…</p>
            </div>
          ) : (
            <>
              {/* SELECT COACH */}
              <div className="card" style={{ marginBottom: 20 }}>
                <label
                  htmlFor="coach-select"
                  style={{ display: 'block', marginBottom: 10, fontWeight: 700 }}
                >
                  Choisir un coach
                </label>

                <select
                  id="coach-select"
                  value={coachId}
                  onChange={(e) => setCoachId(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: 56,
                    borderRadius: 16,
                    border: '1px solid rgba(159,223,224,0.2)',
                    background: 'var(--surface-2)',
                    color: 'var(--text)',
                    padding: '0 1rem',
                    fontSize: 23,
                    fontWeight: 700
                  }}
                >
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* GRID */}
              <ScheduleGrid
                slots={filteredSlots}
                coaches={coaches}
              />

              {/* MOBILE */}
              <ScheduleMobileDay
                slots={filteredSlots}
                coaches={coaches}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}