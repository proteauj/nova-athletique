namespace NovaAthletique.Api.Models;

public class ScheduleSlot
{
    public string Id { get; set; } = string.Empty;
    public string? CoachId { get; set; }
    public string Title { get; set; } = string.Empty;

    public int Day { get; set; }
    public string Start { get; set; } = string.Empty;
    public string End { get; set; } = string.Empty;

    public DateTime StartDateUtc { get; set; }
    public DateTime EndDateUtc { get; set; }

    public string Type { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }

    public string BookingMode { get; set; } = string.Empty; // group | coach
    public bool IsSpecialized { get; set; }

    public int Capacity { get; set; } = 12;
}