namespace NovaAthletique.Api.Contracts;

public class CreateGroupBookingDto
{
    public string SlotId { get; set; } = string.Empty;
    public Guid? SubscriptionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public bool IsTrial { get; set; }
    public DateTime StartTimeUtc { get; set; }
    public DateTime EndTimeUtc { get; set; }
}