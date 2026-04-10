using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaAthletique.Api.Contracts;
using NovaAthletique.Api.Models;
using NovaAthletique.Api.Services;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckoutController : ControllerBase
{
    private readonly ClientStore _clientStore;

    public CheckoutController(ClientStore clientStore)
    {
        _clientStore = clientStore;
    }

    [Authorize]
    [HttpPost("confirm")]
    public IActionResult Confirm([FromBody] ConfirmCheckoutDto dto)
    {
        var client = _clientStore.GetByEmail(dto.ClientEmail);

        if (client is null)
        {
            return NotFound(new { message = "Client introuvable." });
        }

        var subscription = dto.PlanId switch
        {
            "groupe-2x" => new ClientSubscription
            {
                Id = Guid.NewGuid(),
                SubscriptionType = SubscriptionType.Monthly2x,
                IsActive = true,
                PurchasedAtUtc = DateTime.UtcNow,
                CurrentPeriodStartUtc = DateTime.UtcNow,
                CurrentPeriodEndUtc = DateTime.UtcNow.AddMonths(1),
                RemainingSessions = 0
            },

            "groupe-illimite" => new ClientSubscription
            {
                Id = Guid.NewGuid(),
                SubscriptionType = SubscriptionType.MonthlyUnlimited,
                IsActive = true,
                PurchasedAtUtc = DateTime.UtcNow,
                CurrentPeriodStartUtc = DateTime.UtcNow,
                CurrentPeriodEndUtc = DateTime.UtcNow.AddMonths(1),
                RemainingSessions = 0
            },

            "10-seances" => new ClientSubscription
            {
                Id = Guid.NewGuid(),
                SubscriptionType = SubscriptionType.SessionCard,
                IsActive = true,
                PurchasedAtUtc = DateTime.UtcNow,
                CurrentPeriodStartUtc = DateTime.UtcNow,
                CurrentPeriodEndUtc = DateTime.UtcNow.AddYears(1),
                RemainingSessions = 10
            },

            "30-seances" => new ClientSubscription
            {
                Id = Guid.NewGuid(),
                SubscriptionType = SubscriptionType.SessionCard,
                IsActive = true,
                PurchasedAtUtc = DateTime.UtcNow,
                CurrentPeriodStartUtc = DateTime.UtcNow,
                CurrentPeriodEndUtc = DateTime.UtcNow.AddYears(1),
                RemainingSessions = 30
            },

            "drop-in" => new ClientSubscription
            {
                Id = Guid.NewGuid(),
                SubscriptionType = SubscriptionType.SessionCard,
                IsActive = true,
                PurchasedAtUtc = DateTime.UtcNow,
                CurrentPeriodStartUtc = DateTime.UtcNow,
                CurrentPeriodEndUtc = DateTime.UtcNow.AddYears(1),
                RemainingSessions = 1
            },

            _ => null
        };

        if (subscription is null)
        {
            return BadRequest(new { message = "Plan invalide." });
        }

        client.Subscriptions.Add(subscription);

        return Ok(new { success = true });
    }
}