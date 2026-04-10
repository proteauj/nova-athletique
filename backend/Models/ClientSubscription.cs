namespace NovaAthletique.Api.Models;

public class ClientSubscription
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public SubscriptionType SubscriptionType { get; set; }
    public bool IsActive { get; set; }
    public DateTime PurchasedAtUtc { get; set; }
    public DateTime CurrentPeriodStartUtc { get; set; }
    public DateTime CurrentPeriodEndUtc { get; set; }
    public int RemainingSessions { get; set; }

    public bool IncludesSpecializedCourses =>
        SubscriptionType == SubscriptionType.SessionCard;

    public DateTime? ExpiresAt => CurrentPeriodEndUtc;
}