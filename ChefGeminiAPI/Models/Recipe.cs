using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ChefGeminiAPI.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; } // Markdown content

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("User")]
        public int CreatedBy { get; set; }
        public User User { get; set; }

        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}

