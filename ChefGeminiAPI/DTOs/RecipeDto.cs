namespace ChefGeminiAPI.DTOs
{
    public class RecipeDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }

        // This will be used in AddFavorite (a simpler list of names)
        public List<string> Ingredients { get; set; }

        // This can be used in AddRecipe where more detailed ingredient info is needed
        public List<IngredientDTO>? RecipeIngredients { get; set; }

        // Optional: this gets set server-side, but you can keep it for flexibility
        public int? CreatedBy { get; set; }
    }

    public class IngredientDTO
    {
        public string Name { get; set; }
    }
}
