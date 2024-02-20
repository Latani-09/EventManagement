using Duende.IdentityServer.EntityFramework.Options;
using EventManagement.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace EventManagement.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<RSVP> RSVPs { get; set; }
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {


        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Event>().HasMany(e => e.Rsvps);
            builder.Entity<RSVP>()
                    .HasOne(r => r.Event)
                    .WithMany(e => e.Rsvps)
                    .HasForeignKey(r => r.EventID);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
      

    }
}