namespace NovaAthletique.Api.Models;

public class BookingRequest
{
    public string CoachId { get; set; } = string.Empty;
    public string CoachName { get; set; } = string.Empty;
    public string CoachEmail { get; set; } = string.Empty;
    public string CalendarId { get; set; } = string.Empty;

    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;

    public string RequestType { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;

    public DateTime StartTimeUtc { get; set; }
    public DateTime EndTimeUtc { get; set; }

    public string SlotId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;

    public string GoogleEventId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}