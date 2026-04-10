using Microsoft.EntityFrameworkCore;
using NovaAthletique.Api.Models;

namespace NovaAthletique.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
}