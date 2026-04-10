using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Services;

public class BookingAccessService
{
    private readonly GroupBookingStore _groupBookingStore;

    public BookingAccessService(GroupBookingStore groupBookingStore)
    {
        _groupBookingStore = groupBookingStore;
    }

    public BookingEligibilityResult CanBook(
        Client client,
        ClientSubscription subscription,
        ScheduleSlot slot)
    {
        if (!subscription.IsActive)
        {
            return new BookingEligibilityResult
            {
                CanBook = false,
                Code = "SUBSCRIPTION_REQUIRED",
                Message = "Aucun abonnement actif."
            };
        }

        var now = DateTime.UtcNow;

        if (subscription.CurrentPeriodEndUtc < now)
        {
            return new BookingEligibilityResult
            {
                CanBook = false,
                Code = "SUBSCRIPTION_EXPIRED",
                Message = "Votre abonnement est expiré."
            };
        }

        if (slot.IsSpecialized && !subscription.IncludesSpecializedCourses)
        {
            return new BookingEligibilityResult
            {
                CanBook = false,
                Code = "SPECIALIZED_NOT_INCLUDED",
                Message = "Votre abonnement n’inclut pas les cours spécialisés."
            };
        }

        switch (subscription.SubscriptionType)
        {
            case SubscriptionType.SessionCard:
                if (subscription.RemainingSessions <= 0)
                {
                    return new BookingEligibilityResult
                    {
                        CanBook = false,
                        Code = "NO_SESSIONS_LEFT",
                        Message = "Vous n’avez plus de séances disponibles."
                    };
                }
                break;

            case SubscriptionType.Monthly2x:
                {
                    var count = _groupBookingStore.GetBookingCountForPeriod(
                        client.Id.ToString(),
                        subscription.CurrentPeriodStartUtc,
                        subscription.CurrentPeriodEndUtc
                    );

                    if (count >= 2)
                    {
                        return new BookingEligibilityResult
                        {
                            CanBook = false,
                            Code = "WEEKLY_LIMIT_REACHED",
                            Message = "Votre limite de 2 cours par période est atteinte."
                        };
                    }
                    break;
                }

            case SubscriptionType.Monthly3x:
                {
                    var count = _groupBookingStore.GetBookingCountForPeriod(
                        client.Id.ToString(),
                        subscription.CurrentPeriodStartUtc,
                        subscription.CurrentPeriodEndUtc
                    );

                    if (count >= 3)
                    {
                        return new BookingEligibilityResult
                        {
                            CanBook = false,
                            Code = "WEEKLY_LIMIT_REACHED",
                            Message = "Votre limite de 3 cours par période est atteinte."
                        };
                    }
                    break;
                }

            case SubscriptionType.MonthlyUnlimited:
                break;

            case SubscriptionType.FreeAccessUnlimited:
                return new BookingEligibilityResult
                {
                    CanBook = false,
                    Code = "PLAN_NOT_ALLOWED",
                    Message = "Ce plan ne permet pas la réservation de ce cours."
                };

            case SubscriptionType.None:
            default:
                return new BookingEligibilityResult
                {
                    CanBook = false,
                    Code = "SUBSCRIPTION_REQUIRED",
                    Message = "Aucun abonnement valide."
                };
        }

        return new BookingEligibilityResult
        {
            CanBook = true
        };
    }

    public BookingEligibilityResult CanBookFreeTrial(Client client, ScheduleSlot slot)
    {
        if (client.HasUsedFreeTrial)
        {
            return new BookingEligibilityResult
            {
                CanBook = false,
                Code = "FREE_TRIAL_ALREADY_USED",
                Message = "Vous avez déjà utilisé votre essai gratuit."
            };
        }

        if (slot.BookingMode != "group")
        {
            return new BookingEligibilityResult
            {
                CanBook = false,
                Code = "FREE_TRIAL_GROUP_ONLY",
                Message = "L’essai gratuit est disponible uniquement sur les cours de groupe."
            };
        }

        if (!slot.IsAvailable)
        {
            return new BookingEligibilityResult
            {
                CanBook = false,
                Code = "SLOT_UNAVAILABLE",
                Message = "Ce cours n'est pas disponible."
            };
        }

        return new BookingEligibilityResult
        {
            CanBook = true
        };
    }
}