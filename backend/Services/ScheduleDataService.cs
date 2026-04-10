using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Services;

public class ScheduleDataService
{
    public List<Coach> GetCoaches()
    {
        return new List<Coach>
        {
            new()
            {
                Id = "dominique",
                Name = "Dominique Rondeau",
                Email = "dominique@novaathletique.com",
                CalendarId = "ID_CALENDRIER_DOMINIQUE"
            },
            new()
            {
                Id = "jennifer",
                Name = "Jennifer Guimond",
                Email = "jennifer@novaathletique.com",
                CalendarId = "ID_CALENDRIER_JENNIFER"
            },
            new()
            {
                Id = "tom",
                Name = "Tom Niro",
                Email = "tom@novaathletique.com",
                CalendarId = "ID_CALENDRIER_TOM"
            }
        };
    }

    public List<ScheduleSlot> GetScheduleSlots()
    {
        return new List<ScheduleSlot>
        {
            // =========================
            // LUNDI
            // =========================
            CreateGroupSlot("grp-mon-0600", "CrossFit", "jennifer", 1, "06:00", "07:00", false, 12),
            CreateGroupSlot("grp-mon-0900", "CrossFit", "jennifer", 1, "09:00", "10:00", false, 12),
            CreateGroupSlot("grp-mon-1200", "CrossFit", "jennifer", 1, "12:00", "13:00", false, 12),
            CreateGroupSlot("grp-mon-1500", "CrossFit", "jennifer", 1, "15:00", "16:00", false, 12),
            CreateGroupSlot("grp-mon-1615", "CrossFit", "jennifer", 1, "16:15", "17:15", false, 12),
            CreateGroupSlot("grp-mon-1730", "CrossFit", "jennifer", 1, "17:30", "18:30", false, 12),
            CreateGroupSlot("grp-mon-1845", "CrossFit", "jennifer", 1, "18:45", "19:45", false, 12),

            // =========================
            // MARDI
            // pas de 18:45 - 19:45
            // =========================
            CreateGroupSlot("grp-tue-0600", "CrossFit", "jennifer", 2, "06:00", "07:00", false, 12),
            CreateGroupSlot("grp-tue-0900", "CrossFit", "jennifer", 2, "09:00", "10:00", false, 12),
            CreateGroupSlot("grp-tue-1200", "CrossFit", "jennifer", 2, "12:00", "13:00", false, 12),
            CreateGroupSlot("grp-tue-1500", "CrossFit", "jennifer", 2, "15:00", "16:00", false, 12),
            CreateGroupSlot("grp-tue-1615", "CrossFit", "jennifer", 2, "16:15", "17:15", false, 12),
            CreateGroupSlot("grp-tue-1730", "CrossFit", "jennifer", 2, "17:30", "18:30", false, 12),

            // Exemple de cours spécialisé si tu veux en marquer certains
            // CreateGroupSlot("spec-tue-1730", "Pilates", "jennifer", 2, "17:30", "18:30", true, 16, "group"),

            // =========================
            // MERCREDI
            // =========================
            CreateGroupSlot("grp-wed-0600", "CrossFit", "jennifer", 3, "06:00", "07:00", false, 12),
            CreateGroupSlot("grp-wed-0900", "CrossFit", "jennifer", 3, "09:00", "10:00", false, 12),
            CreateGroupSlot("grp-wed-1200", "CrossFit", "jennifer", 3, "12:00", "13:00", false, 12),
            CreateGroupSlot("grp-wed-1500", "CrossFit", "jennifer", 3, "15:00", "16:00", false, 12),
            CreateGroupSlot("grp-wed-1615", "CrossFit", "jennifer", 3, "16:15", "17:15", false, 12),
            CreateGroupSlot("grp-wed-1730", "CrossFit", "jennifer", 3, "17:30", "18:30", false, 12),
            CreateGroupSlot("grp-wed-1845", "CrossFit", "jennifer", 3, "18:45", "19:45", false, 12),

            // =========================
            // JEUDI
            // =========================
            CreateGroupSlot("grp-thu-0600", "CrossFit", "jennifer", 4, "06:00", "07:00", false, 12),
            CreateGroupSlot("grp-thu-0900", "CrossFit", "jennifer", 4, "09:00", "10:00", false, 12),
            CreateGroupSlot("grp-thu-1200", "CrossFit", "jennifer", 4, "12:00", "13:00", false, 12),
            CreateGroupSlot("grp-thu-1500", "CrossFit", "jennifer", 4, "15:00", "16:00", false, 12),
            CreateGroupSlot("grp-thu-1615", "CrossFit", "jennifer", 4, "16:15", "17:15", false, 12),
            CreateGroupSlot("grp-thu-1730", "CrossFit", "jennifer", 4, "17:30", "18:30", false, 12),
            CreateGroupSlot("grp-thu-1845", "CrossFit", "jennifer", 4, "18:45", "19:45", false, 12),

            // =========================
            // VENDREDI
            // 8h-9h et 11h-12h seulement vendredi
            // pas de 18:45 - 19:45
            // =========================
            CreateGroupSlot("grp-fri-0600", "CrossFit", "jennifer", 5, "06:00", "07:00", false, 12),
            CreateGroupSlot("grp-fri-0800", "CrossFit", "jennifer", 5, "08:00", "09:00", false, 12),
            CreateGroupSlot("grp-fri-0900", "CrossFit", "jennifer", 5, "09:00", "10:00", false, 12),
            CreateGroupSlot("grp-fri-1100", "CrossFit", "jennifer", 5, "11:00", "12:00", false, 12),
            CreateGroupSlot("grp-fri-1200", "CrossFit", "jennifer", 5, "12:00", "13:00", false, 12),
            CreateGroupSlot("grp-fri-1500", "CrossFit", "jennifer", 5, "15:00", "16:00", false, 12),
            CreateGroupSlot("grp-fri-1615", "CrossFit", "jennifer", 5, "16:15", "17:15", false, 12),
            CreateGroupSlot("grp-fri-1730", "CrossFit", "jennifer", 5, "17:30", "18:30", false, 12),

            // =========================
            // SAMEDI
            // =========================
            CreateGroupSlot("grp-sat-0800", "CrossFit", "tom", 6, "08:00", "09:00", false, 12),
            CreateGroupSlot("grp-sat-0915", "Cours spécialisé", "tom", 6, "09:15", "10:15", true, 12, "group"),
            CreateGroupSlot("grp-sat-1030", "Cours spécialisé", "tom", 6, "10:30", "11:30", true, 12, "group"),

            // =========================
            // DIMANCHE
            // =========================
            CreateGroupSlot("grp-sun-0800", "CrossFit", "jennifer", 0, "08:00", "09:00", false, 12),
            CreateGroupSlot("grp-sun-0915", "Cours spécialisé", "tom", 0, "09:15", "10:15", true, 12, "group"),
            CreateGroupSlot("grp-sun-1030", "Cours spécialisé", "tom", 0, "10:30", "11:30", true, 12, "group"),
        };
    }

    private static ScheduleSlot CreateGroupSlot(
        string id,
        string title,
        string coachId,
        int day,
        string start,
        string end,
        bool isSpecialized,
        int capacity,
        string type = "group")
    {
        var startDateUtc = BuildNextOccurrenceUtc(day, start);
        var endDateUtc = BuildNextOccurrenceUtc(day, end);

        return new ScheduleSlot
        {
            Id = id,
            Title = title,
            CoachId = coachId,
            Day = day,
            Start = start,
            End = end,
            StartDateUtc = startDateUtc,
            EndDateUtc = endDateUtc,
            Type = type,
            BookingMode = "group",
            IsSpecialized = isSpecialized,
            Capacity = capacity,
            IsAvailable = true
        };
    }

    private static ScheduleSlot CreateCoachSlot(
        string id,
        string title,
        string coachId,
        int day,
        string start,
        string end)
    {
        var startDateUtc = BuildNextOccurrenceUtc(day, start);
        var endDateUtc = BuildNextOccurrenceUtc(day, end);

        return new ScheduleSlot
        {
            Id = id,
            Title = title,
            CoachId = coachId,
            Day = day,
            Start = start,
            End = end,
            StartDateUtc = startDateUtc,
            EndDateUtc = endDateUtc,
            Type = "private",
            BookingMode = "coach",
            IsSpecialized = false,
            Capacity = 1,
            IsAvailable = true
        };
    }

    private static DateTime BuildNextOccurrenceUtc(int targetDay, string time)
    {
        var nowLocal = DateTime.Now;
        var today = (int)nowLocal.DayOfWeek;
        var delta = targetDay - today;

        if (delta < 0)
            delta += 7;

        var targetDate = nowLocal.Date.AddDays(delta);

        var parts = time.Split(':');
        var hour = int.Parse(parts[0]);
        var minute = int.Parse(parts[1]);

        var localDateTime = new DateTime(
            targetDate.Year,
            targetDate.Month,
            targetDate.Day,
            hour,
            minute,
            0,
            DateTimeKind.Local
        );

        return localDateTime.ToUniversalTime();
    }
}