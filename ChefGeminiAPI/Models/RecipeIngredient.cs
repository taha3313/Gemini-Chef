using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace ChefGeminiAPI.Models
{
    public class RecipeIngredient
    {
        [ForeignKey("Recipe")]
        public int RecipeId { get; set; }

        [JsonIgnore]
        public Recipe Recipe { get; set; }

        [ForeignKey("Ingredient")]
        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }
    }

}
