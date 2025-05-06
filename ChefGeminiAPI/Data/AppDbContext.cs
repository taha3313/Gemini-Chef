using ChefGeminiAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ChefGeminiAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Ingredient>().HasData(
    new Ingredient { Id = 1, Name = "Tomato" },
    new Ingredient { Id = 2, Name = "Onion" },
    new Ingredient { Id = 3, Name = "Garlic" },
    new Ingredient { Id = 4, Name = "Olive Oil" },
    new Ingredient { Id = 5, Name = "Salt" },
    new Ingredient { Id = 6, Name = "Black Pepper" },
    new Ingredient { Id = 7, Name = "Basil" },
    new Ingredient { Id = 8, Name = "Oregano" },
    new Ingredient { Id = 9, Name = "Paprika" },
    new Ingredient { Id = 10, Name = "Chicken Breast" }
// Add more if needed
);

            modelBuilder.Entity<RecipeIngredient>()
                .HasKey(ri => new { ri.RecipeId, ri.IngredientId });

            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserId, f.RecipeId });

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict); // ✅ prevent multiple cascade paths

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Recipe)
                .WithMany(r => r.Favorites)
                .HasForeignKey(f => f.RecipeId)
                .OnDelete(DeleteBehavior.Cascade); // ✅ allowed, as it's the only cascade
        }

    }
}
