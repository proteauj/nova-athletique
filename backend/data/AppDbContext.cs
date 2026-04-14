using Microsoft.EntityFrameworkCore;
using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<ClientSubscription> ClientSubscriptions => Set<ClientSubscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.HasMany(c => c.Subscriptions)
                .WithOne()
                .HasForeignKey("ClientId")
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ClientSubscription>(entity =>
        {
            entity.HasKey(s => s.Id);
        });
    }
}