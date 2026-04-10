using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Services;

public class GroupBookingStore
{
    private static readonly Dictionary<string, List<GroupBooking>> _bookingsBySlot = new();

    public IReadOnlyList<GroupBooking> GetBookingsForSlot(string slotId)
    {
        if (!_bookingsBySlot.TryGetValue(slotId, out var bookings))
            return Array.Empty<GroupBooking>();

        return bookings;
    }

    public bool IsAlreadyBooked(string slotId, string clientId)
    {
        if (!_bookingsBySlot.TryGetValue(slotId, out var bookings))
            return false;

        return bookings.Any(x => x.ClientId == clientId);
    }

    public GroupBooking AddBooking(GroupBooking booking)
    {
        if (!_bookingsBySlot.ContainsKey(booking.SlotId))
        {
            _bookingsBySlot[booking.SlotId] = new List<GroupBooking>();
        }

        _bookingsBySlot[booking.SlotId].Add(booking);
        return booking;
    }

    public int GetReservedCount(string slotId)
    {
        if (!_bookingsBySlot.TryGetValue(slotId, out var bookings))
            return 0;

        return bookings.Count;
    }

    public int GetBookingCountForPeriod(
        string clientId,
        DateTime periodStartUtc,
        DateTime periodEndUtc)
    {
        return _bookingsBySlot.Values
            .SelectMany(x => x)
            .Count(x =>
                x.ClientId == clientId &&
                x.StartTimeUtc >= periodStartUtc &&
                x.StartTimeUtc < periodEndUtc);
    }
}