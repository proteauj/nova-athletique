type SlotBookingMode = 'coach' | 'group';

export type Coach = {
  id: string;
  name: string;
  email: string;
  calendarId: string;
};

export type ScheduleSlot = {
  id: string;
  coachId?: string;
  title: string;
  day: number;
  start: string;
  end: string;
  type: 'group' | 'private' | 'spinning' | 'corporate';
  bookingMode: 'group' | 'coach';
  isAvailable?: boolean;
  isSpecialized?: boolean;
  capacity?: number;
  reservedCount?: number;
};

export type BookingRequestPayload = {
  coachId: string;
  coachName: string;
  coachEmail: string;
  calendarId: string;
  clientName: string;
  clientEmail: string;
  requestType: string;
  note: string;
  startTimeUtc: string;
  endTimeUtc: string;
  slotId: string;
  title: string;
};

export type ViewerAccess = {
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
};