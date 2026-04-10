namespace NovaAthletique.Api.Models;

public class GroupBooking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SlotId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public bool IsTrial { get; set; }
    public DateTime StartTimeUtc { get; set; }
    public DateTime EndTimeUtc { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}