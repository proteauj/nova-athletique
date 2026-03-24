namespace NovaAthletique.Api.Models;

public class Subscription
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid PlanId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string StripeSubscriptionId { get; set; }

    public Plan Plan { get; set; }
}
