using System.Net;
using System.Net.Mail;

namespace NovaAthletique.Api.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendGroupBookingConfirmationAsync(
        string toEmail,
        string clientName,
        string title,
        DateTime startUtc,
        DateTime endUtc,
        bool isTrial)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPort = int.TryParse(_configuration["Email:SmtpPort"], out var port) ? port : 587;
        var smtpUser = _configuration["Email:Username"];
        var smtpPassword = _configuration["Email:Password"];
        var fromEmail = _configuration["Email:From"];

        if (string.IsNullOrWhiteSpace(smtpHost) ||
            string.IsNullOrWhiteSpace(fromEmail) ||
            string.IsNullOrWhiteSpace(toEmail))
        {
            return;
        }

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUser, smtpPassword),
            EnableSsl = true
        };

        var subject = isTrial
            ? "Confirmation de votre essai gratuit"
            : "Confirmation de votre réservation";

        var localStart = startUtc.ToLocalTime();
        var localEnd = endUtc.ToLocalTime();

        var body =
$@"Bonjour {clientName},

Votre {(isTrial ? "essai gratuit" : "réservation")} est confirmé(e).

Cours : {title}
Début : {localStart:yyyy-MM-dd HH:mm}
Fin : {localEnd:yyyy-MM-dd HH:mm}

Merci,
Nova Athlétique";

        using var mail = new MailMessage(fromEmail, toEmail, subject, body);
        await client.SendMailAsync(mail);
    }
}