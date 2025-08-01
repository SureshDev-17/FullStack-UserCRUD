using Microsoft.EntityFrameworkCore;
using UserAPI.Models;

namespace UserAPI.Data
{
    public class AppDbContext : DbContext
    {
        public  AppDbContext(DbContextOptions<AppDbContext>options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
