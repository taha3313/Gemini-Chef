using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace ChefGeminiAPI.Models
{

    public class Ingredient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
    }

}
