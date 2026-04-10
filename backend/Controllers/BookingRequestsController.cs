using Microsoft.AspNetCore.Mvc;
using NovaAthletique.Api.Contracts;
using NovaAthletique.Api.Models;
using NovaAthletique.Api.Services;

namespace NovaAthletique.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingRequestsController : ControllerBase
{
    private readonly GoogleCalendarService _googleCalendarService;

    public BookingRequestsController(GoogleCalendarService googleCalendarService)
    {
        _googleCalendarService = googleCalendarService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.ClientName))
            return BadRequest("Le nom du client est requis.");

        if (string.IsNullOrWhiteSpace(dto.ClientEmail))
            return BadRequest("Le courriel du client est requis.");

        if (string.IsNullOrWhiteSpace(dto.CoachName))
            return BadRequest("Le nom du coach est requis.");

        if (string.IsNullOrWhiteSpace(dto.CoachEmail))
            return BadRequest("Le courriel du coach est requis.");

        if (string.IsNullOrWhiteSpace(dto.CalendarId))
            return BadRequest("Le calendarId du coach est requis.");

        if (dto.StartTimeUtc >= dto.EndTimeUtc)
            return BadRequest("L'heure de fin doit être après l'heure de début.");

        try
        {
            var summary = $"{dto.RequestType.Replace("_", " ")} - {dto.ClientName}";
            var description =
$@"Type de demande : {dto.RequestType}
Client : {dto.ClientName}
Courriel client : {dto.ClientEmail}
Coach : {dto.CoachName}
Courriel coach : {dto.CoachEmail}
Créneau : {dto.Title} ({dto.StartTimeUtc:u} à {dto.EndTimeUtc:u})

Note :
{dto.Note}";

            var googleEventId = await _googleCalendarService.CreateEventAsync(
                dto.CalendarId,
                summary,
                description,
                dto.StartTimeUtc,
                dto.EndTimeUtc,
                dto.CoachEmail,
                dto.ClientEmail
            );

            var result = new BookingRequest
            {
                CoachId = dto.CoachId,
                CoachName = dto.CoachName,
                CoachEmail = dto.CoachEmail,
                CalendarId = dto.CalendarId,
                ClientName = dto.ClientName,
                ClientEmail = dto.ClientEmail,
                RequestType = dto.RequestType,
                Note = dto.Note,
                StartTimeUtc = dto.StartTimeUtc,
                EndTimeUtc = dto.EndTimeUtc,
                SlotId = dto.SlotId,
                Title = dto.Title,
                GoogleEventId = googleEventId,
                Status = "Created"
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                $"Erreur lors de la création de l'événement Google Calendar: {ex.Message}"
            );
        }
    }
}