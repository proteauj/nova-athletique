namespace NovaAthletique.Api.Models;

public class Booking
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ScheduleId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Schedule Schedule { get; set; }
}
