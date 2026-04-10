using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Models;

public class Client
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public bool HasUsedFreeTrial { get; set; }
    public DateTime? FreeTrialUsedAtUtc { get; set; }

    public List<ClientSubscription> Subscriptions { get; set; } = new();

    public string FullName => $"{FirstName} {LastName}".Trim();
}