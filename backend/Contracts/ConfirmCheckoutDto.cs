namespace NovaAthletique.Api.Contracts;

public class ConfirmCheckoutDto
{
    public string PlanId { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
}