namespace NovaAthletique.Api.Models;

public class Plan
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int? WeeklyLimit { get; set; }
    public string StripePriceId { get; set; }
}
