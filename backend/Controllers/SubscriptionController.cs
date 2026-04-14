using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaAthletique.Api.Data;
using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SubscriptionsController(AppDbContext db)
    {
        _db = db;
    }

    public class StripeWebhookSubscriptionRequest
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string StripeSessionId { get; set; } = string.Empty;
        public string? StripeCustomerId { get; set; }
        public string? StripeSubscriptionId { get; set; }
        public string PlanId { get; set; } = string.Empty;
    }

    [HttpPost("stripe-webhook")]
    public async Task<IActionResult> CreateFromStripeWebhook([FromBody] StripeWebhookSubscriptionRequest request)
    {
        if (!Guid.TryParse(request.ClientId, out var clientId))
        {
            return BadRequest("clientId invalide.");
        }

        var client = await _db.Clients
            .Include(c => c.Subscriptions)
            .FirstOrDefaultAsync(c => c.Id == clientId);

        if (client is null)
        {
            return NotFound("Client introuvable.");
        }

        var now = DateTime.UtcNow;

        var alreadyExists = client.Subscriptions.Any(s =>
            s.IsActive &&
            s.SubscriptionType == MapSubscriptionType(request.PlanId) &&
            s.CurrentPeriodEndUtc >= now);

        if (alreadyExists)
        {
            return Ok(new
            {
                success = true,
                message = "Abonnement déjà actif."
            });
        }

        var subscription = new ClientSubscription
        {
            Id = Guid.NewGuid(),
            SubscriptionType = MapSubscriptionType(request.PlanId),
            IsActive = true,
            PurchasedAtUtc = now,
            CurrentPeriodStartUtc = now,
            CurrentPeriodEndUtc = GetEndDate(now, request.PlanId),
            RemainingSessions = GetRemainingSessions(request.PlanId)
        };

        client.Subscriptions.Add(subscription);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            clientId = client.Id,
            subscriptionId = subscription.Id,
            subscriptionType = subscription.SubscriptionType.ToString(),
            remainingSessions = subscription.RemainingSessions
        });
    }

    private static SubscriptionType MapSubscriptionType(string planId) =>
        planId switch
        {
            "groupe-2x" => SubscriptionType.Monthly2x,
            "groupe-illimite" => SubscriptionType.MonthlyUnlimited,
            "libre-illimite" => SubscriptionType.MonthlyUnlimited,
            "10-seances" => SubscriptionType.SessionCard,
            "30-seances" => SubscriptionType.SessionCard,
            "drop-in" => SubscriptionType.SessionCard,
            _ => throw new ArgumentException($"PlanId inconnu: {planId}")
        };

    private static int GetRemainingSessions(string planId) =>
        planId switch
        {
            "10-seances" => 10,
            "30-seances" => 30,
            "drop-in" => 1,
            _ => 0
        };

    private static DateTime GetEndDate(DateTime start, string planId) =>
        planId switch
        {
            "groupe-2x" => start.AddMonths(1),
            "groupe-illimite" => start.AddMonths(1),
            "libre-illimite" => start.AddMonths(1),
            "10-seances" => start.AddMonths(12),
            "30-seances" => start.AddMonths(12),
            "drop-in" => start.AddMonths(12),
            _ => start.AddMonths(1)
        };
}