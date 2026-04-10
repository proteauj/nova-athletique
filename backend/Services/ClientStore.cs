using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Services;

public class ClientStore
{
    private static readonly List<Client> _clients =
    [
        new Client
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Email = "abonne2x@example.com",
            Password = "test123",
            FirstName = "Client",
            LastName = "2x",
            Subscriptions =
            [
                new ClientSubscription
                {
                    Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                    SubscriptionType = SubscriptionType.Monthly2x,
                    IsActive = true,
                    PurchasedAtUtc = DateTime.UtcNow.AddDays(-10),
                    CurrentPeriodStartUtc = DateTime.UtcNow.AddDays(-3),
                    CurrentPeriodEndUtc = DateTime.UtcNow.AddDays(4),
                    RemainingSessions = 0
                }
            ]
        },
        new Client
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Email = "abonne3x@example.com",
            Password = "test123",
            FirstName = "Client",
            LastName = "3x",
            Subscriptions =
            [
                new ClientSubscription
                {
                    Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                    SubscriptionType = SubscriptionType.Monthly3x,
                    IsActive = true,
                    PurchasedAtUtc = DateTime.UtcNow.AddDays(-20),
                    CurrentPeriodStartUtc = DateTime.UtcNow.AddDays(-2),
                    CurrentPeriodEndUtc = DateTime.UtcNow.AddDays(5),
                    RemainingSessions = 0
                }
            ]
        },
        new Client
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Email = "illimite@example.com",
            Password = "test123",
            FirstName = "Client",
            LastName = "Illimité",
            Subscriptions =
            [
                new ClientSubscription
                {
                    Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                    SubscriptionType = SubscriptionType.MonthlyUnlimited,
                    IsActive = true,
                    PurchasedAtUtc = DateTime.UtcNow.AddDays(-15),
                    CurrentPeriodStartUtc = DateTime.UtcNow.AddDays(-1),
                    CurrentPeriodEndUtc = DateTime.UtcNow.AddDays(6),
                    RemainingSessions = 0
                }
            ]
        },
        new Client
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Email = "carte@example.com",
            Password = "test123",
            FirstName = "Client",
            LastName = "Carte",
            Subscriptions =
            [
                new ClientSubscription
                {
                    Id = Guid.Parse("a4444444-4444-4444-4444-444444444444"),
                    SubscriptionType = SubscriptionType.SessionCard,
                    IsActive = true,
                    PurchasedAtUtc = DateTime.UtcNow.AddDays(-30),
                    CurrentPeriodStartUtc = DateTime.UtcNow.AddDays(-30),
                    CurrentPeriodEndUtc = DateTime.UtcNow.AddMonths(12),
                    RemainingSessions = 8
                },
                new ClientSubscription
                {
                    Id = Guid.Parse("b4444444-4444-4444-4444-444444444444"),
                    SubscriptionType = SubscriptionType.MonthlyUnlimited,
                    IsActive = true,
                    PurchasedAtUtc = DateTime.UtcNow.AddDays(-7),
                    CurrentPeriodStartUtc = DateTime.UtcNow.AddDays(-7),
                    CurrentPeriodEndUtc = DateTime.UtcNow.AddDays(23),
                    RemainingSessions = 0
                }
            ]
        },
        new Client
        {
            Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
            Email = "sansabonnement@example.com",
            Password = "test123",
            FirstName = "Client",
            LastName = "Sans Abonnement",
            Subscriptions = []
        }
    ];

    public Client? Validate(string email, string password)
    {
        return _clients.FirstOrDefault(x =>
            x.Email.Equals(email, StringComparison.OrdinalIgnoreCase) &&
            x.Password == password);
    }

    public Client? GetById(Guid id)
    {
        return _clients.FirstOrDefault(x => x.Id == id);
    }

    public ClientSubscription? GetSubscription(Guid clientId, Guid subscriptionId)
    {
        var client = GetById(clientId);
        return client?.Subscriptions.FirstOrDefault(x => x.Id == subscriptionId && x.IsActive);
    }

    public List<ClientSubscription> GetActiveSubscriptions(Guid clientId)
    {
        var client = GetById(clientId);
        return client?.Subscriptions.Where(x => x.IsActive).ToList() ?? [];
    }

    public void ConsumeSessionIfNeeded(Guid clientId, Guid subscriptionId)
    {
        var subscription = GetSubscription(clientId, subscriptionId);
        if (subscription is null) return;

        if (subscription.SubscriptionType == SubscriptionType.SessionCard &&
            subscription.RemainingSessions > 0)
        {
            subscription.RemainingSessions--;
        }
    }

    public void MarkFreeTrialAsUsed(Guid clientId)
    {
        var client = GetById(clientId);
        if (client is null) return;

        client.HasUsedFreeTrial = true;
        client.FreeTrialUsedAtUtc = DateTime.UtcNow;
    }

    public Client? GetByEmail(string email)
    {
        return _clients.FirstOrDefault(x =>
            x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }
}