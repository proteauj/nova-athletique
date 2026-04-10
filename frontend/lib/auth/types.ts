export type User = {
  clientId: string;
  fullName: string;
  email: string;
  hasActiveSubscription?: boolean;
  remainingSessions?: number;
  subscriptionType?: string;
  hasUsedFreeTrial?: boolean;
  includesSpecializedCourses?: boolean;
};