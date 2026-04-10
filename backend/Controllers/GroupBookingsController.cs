using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaAthletique.Api.Contracts;
using NovaAthletique.Api.Models;
using NovaAthletique.Api.Services;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupBookingsController : ControllerBase
{
    private readonly GroupBookingStore _groupBookingStore;
    private readonly EmailService _emailService;
    private readonly ClientStore _clientStore;
    private readonly ScheduleDataService _scheduleDataService;
    private readonly BookingAccessService _bookingAccessService;

    public GroupBookingsController(
        GroupBookingStore groupBookingStore,
        EmailService emailService,
        ClientStore clientStore,
        ScheduleDataService scheduleDataService,
        BookingAccessService bookingAccessService)
    {
        _groupBookingStore = groupBookingStore;
        _emailService = emailService;
        _clientStore = clientStore;
        _scheduleDataService = scheduleDataService;
        _bookingAccessService = bookingAccessService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGroupBookingDto dto)
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? User.FindFirstValue("sub");

        if (!Guid.TryParse(sub, out var clientId))
        {
            return Unauthorized(new
            {
                code = "UNAUTHORIZED",
                message = "Utilisateur non authentifié."
            });
        }

        var client = _clientStore.GetById(clientId);
        if (client is null)
        {
            return Unauthorized(new
            {
                code = "CLIENT_NOT_FOUND",
                message = "Client introuvable."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.SlotId))
        {
            return BadRequest(new
            {
                code = "INVALID_SLOT",
                message = "SlotId requis."
            });
        }

        var slot = _scheduleDataService.GetScheduleSlots()
            .FirstOrDefault(x => x.Id == dto.SlotId);

        if (slot is null)
        {
            return NotFound(new
            {
                code = "SLOT_NOT_FOUND",
                message = "Cours introuvable."
            });
        }

        if (!slot.IsAvailable)
        {
            return BadRequest(new
            {
                code = "SLOT_UNAVAILABLE",
                message = "Ce cours n'est pas disponible."
            });
        }

        if (slot.BookingMode != "group")
        {
            return BadRequest(new
            {
                code = "INVALID_BOOKING_MODE",
                message = "Ce créneau n'est pas réservable comme cours de groupe."
            });
        }

        if (_groupBookingStore.IsAlreadyBooked(slot.Id, client.Id.ToString()))
        {
            return BadRequest(new
            {
                code = "ALREADY_BOOKED",
                message = "Vous êtes déjà inscrit à ce cours."
            });
        }

        var reservedCountBefore = _groupBookingStore.GetReservedCount(slot.Id);
        var capacity = slot.Capacity > 0 ? slot.Capacity : 12;

        if (reservedCountBefore >= capacity)
        {
            return BadRequest(new
            {
                code = "COURSE_FULL",
                message = "Ce cours est complet."
            });
        }

        BookingEligibilityResult eligibility;
        ClientSubscription? selectedSubscription = null;

        if (dto.IsTrial)
        {
            eligibility = _bookingAccessService.CanBookFreeTrial(client, slot);
        }
        else
        {
            if (dto.SubscriptionId is null)
            {
                return BadRequest(new
                {
                    code = "SUBSCRIPTION_REQUIRED",
                    message = "Veuillez choisir un abonnement."
                });
            }

            selectedSubscription = client.Subscriptions
                .FirstOrDefault(s => s.Id == dto.SubscriptionId.Value && s.IsActive);

            if (selectedSubscription is null)
            {
                return BadRequest(new
                {
                    code = "INVALID_SUBSCRIPTION",
                    message = "Abonnement invalide."
                });
            }

            eligibility = _bookingAccessService.CanBook(client, selectedSubscription, slot);
        }

        if (!eligibility.CanBook)
        {
            return BadRequest(new
            {
                code = eligibility.Code,
                message = eligibility.Message
            });
        }

        var booking = new GroupBooking
        {
            SlotId = slot.Id,
            ClientId = client.Id.ToString(),
            ClientName = client.FullName,
            ClientEmail = client.Email,
            Title = slot.Title,
            IsTrial = dto.IsTrial,
            StartTimeUtc = slot.StartDateUtc,
            EndTimeUtc = slot.EndDateUtc
        };

        _groupBookingStore.AddBooking(booking);

        if (dto.IsTrial)
        {
            _clientStore.MarkFreeTrialAsUsed(client.Id);
        }
        else if (selectedSubscription is not null)
        {
            _clientStore.ConsumeSessionIfNeeded(client.Id, selectedSubscription.Id);
        }

        try
        {
            await _emailService.SendGroupBookingConfirmationAsync(
                client.Email,
                client.FullName,
                slot.Title,
                slot.StartDateUtc,
                slot.EndDateUtc,
                dto.IsTrial
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erreur envoi Gmail:");
            Console.WriteLine(ex.Message);
        }

        var reservedCountAfter = _groupBookingStore.GetReservedCount(slot.Id);
        var updatedClient = _clientStore.GetById(client.Id);

        var updatedActiveSubscriptions = updatedClient?.Subscriptions
            .Where(s => s.IsActive)
            .Select(s => new
            {
                id = s.Id,
                isActive = s.IsActive,
                remainingSessions = s.RemainingSessions,
                subscriptionType = s.SubscriptionType.ToString(),
                includesSpecializedCourses = s.IncludesSpecializedCourses,
                expiresAt = s.ExpiresAt
            })
            .ToList() ?? [];

        var primary = updatedActiveSubscriptions.FirstOrDefault();

        return Ok(new
        {
            success = true,
            code = dto.IsTrial ? "TRIAL_BOOKED" : "BOOKED",
            message = dto.IsTrial
                ? "Votre essai est réservé."
                : "Votre place est réservée.",
            slotId = slot.Id,
            reservedCount = reservedCountAfter,
            remaining = capacity - reservedCountAfter,
            subscriptionType = primary?.subscriptionType,
            clientRemainingSessions = primary?.remainingSessions ?? 0,
            hasActiveSubscription = updatedActiveSubscriptions.Count > 0,
            hasUsedFreeTrial = updatedClient?.HasUsedFreeTrial ?? false,
            activeSubscriptions = updatedActiveSubscriptions
        });
    }

    [Authorize]
    [HttpGet("{slotId}")]
    public IActionResult GetBySlot(string slotId)
    {
        var slot = _scheduleDataService.GetScheduleSlots()
            .FirstOrDefault(x => x.Id == slotId);

        if (slot is null)
        {
            return NotFound(new
            {
                code = "SLOT_NOT_FOUND",
                message = "Cours introuvable."
            });
        }

        var bookings = _groupBookingStore.GetBookingsForSlot(slotId);
        var reservedCount = bookings.Count;
        var capacity = slot.Capacity > 0 ? slot.Capacity : 12;

        return Ok(new
        {
            slotId,
            reservedCount,
            capacity,
            remaining = capacity - reservedCount
        });
    }
}