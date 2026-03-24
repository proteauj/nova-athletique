using Microsoft.EntityFrameworkCore;
using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Class> Classes { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Plan> Plans { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
}
