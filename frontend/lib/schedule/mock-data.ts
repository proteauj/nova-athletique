import { Coach, ScheduleSlot } from './types';

export const coaches: Coach[] = [
  {
    id: 'dominique',
    name: 'Dominique Rondeau',
    email: 'dominique@novaathletique.com',
    calendarId: 'A_REMPLACER'
  },
  {
    id: 'jennifer',
    name: 'Jennifer Guimond',
    email: 'jennifer@novaathletique.com',
    calendarId: 'A_REMPLACER'
  },
  {
    id: 'tom',
    name: 'Tom Niro',
    email: 'tom@novaathletique.com',
    calendarId: 'A_REMPLACER'
  }
];

export const scheduleSlots: ScheduleSlot[] = [
  {
    id: '1',
    title: 'Groupe',
    coachId: 'dominique',
    day: 1,
    start: '06:00',
    end: '07:00',
    type: 'group',
    bookingMode: 'group',
    capacity: 12,
    reservedCount: 0,
    isAvailable: true
  },
  {
    id: '2',
    title: 'Privé',
    coachId: 'jennifer',
    day: 1,
    start: '17:00',
    end: '18:00',
    type: 'private',
    bookingMode: 'coach',
    isAvailable: true
  },
  {
    id: '3',
    title: 'Spinning',
    coachId: 'tom',
    day: 2,
    start: '07:00',
    end: '08:00',
    type: 'spinning',
    bookingMode: 'group',
    capacity: 12,
    reservedCount: 0,
    isAvailable: true
  }
];