namespace NovaAthletique.Api.Contracts;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public bool HasActiveSubscription { get; set; }
    public int RemainingSessions { get; set; }
    public string SubscriptionType { get; set; } = string.Empty;
    public bool HasUsedFreeTrial { get; set; }
    public bool IncludesSpecializedCourses { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public List<ActiveSubscriptionDto> ActiveSubscriptions { get; set; } = [];
}