using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace ChefGeminiAPI.Models
{
    public class Favorite
    {
        [ForeignKey("User")]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [ForeignKey("Recipe")]
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }

}
