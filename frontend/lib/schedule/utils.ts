import { ScheduleSlot } from './types';

export const DAYS = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
];

export const HOURS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  return `${String(hour).padStart(2, '0')}:00`;
});

export function timeToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

export function getSlotsForDay(slots: ScheduleSlot[], day: number) {
  return slots.filter((slot) => slot.day === day);
}

export function getUpcomingSlotsForToday(
  slots: ScheduleSlot[],
  today: number,
  nowMinutes: number
) {
  return slots.filter(
    (slot) => slot.day === today && timeToMinutes(slot.start) > nowMinutes
  );
}

export function filterSlotsByCoach(slots: ScheduleSlot[], coachId?: string) {
  if (!coachId) return slots;
  return slots.filter((slot) => slot.coachId === coachId);
}