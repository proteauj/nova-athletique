using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaAthletique.Api.Data;
using NovaAthletique.Api.Services;
using NovaAthletique.Api.Models;
using System.IdentityModel.Tokens.Jwt;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext db, JwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var client = await _db.Clients
            .Include(c => c.Subscriptions)
            .FirstOrDefaultAsync(c => c.Email == request.Email);

        if (client is null)
            return Unauthorized();

        if (client.Password != request.Password)
            return Unauthorized();

        var token = _jwtService.GenerateToken(client);

        var activeSubscriptions = client.Subscriptions
            .Where(s => s.IsActive &&
                        s.CurrentPeriodStartUtc <= DateTime.UtcNow &&
                        s.CurrentPeriodEndUtc >= DateTime.UtcNow)
            .Select(s => new
            {
                id = s.Id,
                isActive = s.IsActive,
                remainingSessions = s.RemainingSessions,
                subscriptionType = s.SubscriptionType,
                includesSpecializedCourses = s.IncludesSpecializedCourses,
                expiresAt = s.CurrentPeriodEndUtc
            })
            .ToList();

        var primary = activeSubscriptions.FirstOrDefault();

        return Ok(new
        {
            token,
            client = new
            {
                id = client.Id,
                email = client.Email,
                fullName = client.FullName,
                hasActiveSubscription = activeSubscriptions.Any(),
                remainingSessions = primary?.remainingSessions ?? 0,
                subscriptionType = primary?.subscriptionType,
                hasUsedFreeTrial = client.HasUsedFreeTrial,
                hasSpecializedAccess = activeSubscriptions.Any(s => s.includesSpecializedCourses),
                activeSubscriptions
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(sub) || !Guid.TryParse(sub, out var clientId))
            return Unauthorized();

        var client = await _db.Clients
            .Include(c => c.Subscriptions)
            .FirstOrDefaultAsync(c => c.Id == clientId);

        if (client is null)
            return Unauthorized();

        var activeSubscriptions = client.Subscriptions
            .Where(s => s.IsActive &&
                        s.CurrentPeriodStartUtc <= DateTime.UtcNow &&
                        s.CurrentPeriodEndUtc >= DateTime.UtcNow)
            .Select(s => new
            {
                id = s.Id,
                isActive = s.IsActive,
                remainingSessions = s.RemainingSessions,
                subscriptionType = s.SubscriptionType,
                includesSpecializedCourses = s.IncludesSpecializedCourses,
                expiresAt = s.CurrentPeriodEndUtc
            })
            .ToList();

        var primary = activeSubscriptions.FirstOrDefault();

        return Ok(new
        {
            id = client.Id,
            fullName = client.FullName,
            email = client.Email,
            hasActiveSubscription = activeSubscriptions.Any(),
            remainingSessions = primary?.remainingSessions ?? 0,
            subscriptionType = primary?.subscriptionType,
            hasUsedFreeTrial = client.HasUsedFreeTrial,
            hasSpecializedAccess = activeSubscriptions.Any(s => s.includesSpecializedCourses),
            activeSubscriptions
        });
    }
}