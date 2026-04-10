namespace NovaAthletique.Api.Contracts;

public class ActiveSubscriptionDto
{
    public Guid Id { get; set; }
    public bool IsActive { get; set; }
    public int RemainingSessions { get; set; }
    public string SubscriptionType { get; set; } = string.Empty;
    public bool IncludesSpecializedCourses { get; set; }
    public DateTime? ExpiresAt { get; set; }
}