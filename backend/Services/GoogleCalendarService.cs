using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;

namespace NovaAthletique.Api.Services;

public class GoogleCalendarService
{
    private readonly IConfiguration _configuration;

    public GoogleCalendarService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private CalendarService CreateCalendarService()
    {
        var credentialPath = _configuration["GoogleCalendar:ServiceAccountKeyPath"];
        var delegatedUser = _configuration["GoogleCalendar:DelegatedUser"];

        if (string.IsNullOrWhiteSpace(credentialPath))
            throw new InvalidOperationException("GoogleCalendar:ServiceAccountKeyPath est manquant.");

        if (!File.Exists(credentialPath))
            throw new FileNotFoundException(
                $"Le fichier de clé Google n'existe pas: {credentialPath}"
            );

        if (string.IsNullOrWhiteSpace(delegatedUser))
            throw new InvalidOperationException("GoogleCalendar:DelegatedUser est manquant.");

        var credential = GoogleCredential
            .FromFile(credentialPath)
            .CreateScoped(CalendarService.Scope.Calendar)
            .CreateWithUser(delegatedUser);

        return new CalendarService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "Nova Athletique"
        });
    }

    public async Task<string> CreateEventAsync(
        string calendarId,
        string summary,
        string description,
        DateTime startUtc,
        DateTime endUtc,
        string coachEmail,
        string clientEmail)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("Le calendarId est requis.");

        if (string.IsNullOrWhiteSpace(coachEmail))
            throw new InvalidOperationException("Le courriel du coach est requis.");

        if (string.IsNullOrWhiteSpace(clientEmail))
            throw new InvalidOperationException("Le courriel du client est requis.");

        var service = CreateCalendarService();

        var newEvent = new Event
        {
            Summary = summary,
            Description = description,
            Start = new EventDateTime
            {
                DateTimeDateTimeOffset = new DateTimeOffset(
                    DateTime.SpecifyKind(startUtc, DateTimeKind.Utc)
                ),
                TimeZone = "America/Toronto"
            },
            End = new EventDateTime
            {
                DateTimeDateTimeOffset = new DateTimeOffset(
                    DateTime.SpecifyKind(endUtc, DateTimeKind.Utc)
                ),
                TimeZone = "America/Toronto"
            },
            Attendees = new List<EventAttendee>
            {
                new() { Email = coachEmail },
                new() { Email = clientEmail }
            },
            Reminders = new Event.RemindersData
            {
                UseDefault = false,
                Overrides = new List<EventReminder>
                {
                    new() { Method = "email", Minutes = 24 * 60 },
                    new() { Method = "popup", Minutes = 30 }
                }
            }
        };

        var request = service.Events.Insert(newEvent, calendarId);
        request.SendUpdates = EventsResource.InsertRequest.SendUpdatesEnum.All;

        var created = await request.ExecuteAsync();
        return created.Id;
    }
}