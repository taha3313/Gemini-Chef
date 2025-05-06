using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ChefGeminiAPI.Models
{

    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public ICollection<Recipe> Recipes { get; set; }
        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; }
    }


}
