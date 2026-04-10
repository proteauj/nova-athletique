using NovaAthletique.Api.Models;

public class Subscription
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string SubscriptionType { get; set; } = "";
    public bool IsActive { get; set; }
    public bool IncludesSpecializedCourses { get; set; }
    public int? RemainingSessions { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public Client Client { get; set; } = null!;
}