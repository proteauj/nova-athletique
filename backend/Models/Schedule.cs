namespace NovaAthletique.Api.Models;

public class Schedule
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public Class Class { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
