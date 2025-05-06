using ChefGeminiAPI.Models;
using ChefGeminiAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ChefGeminiAPI.DTOs;

namespace ChefGeminiAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecipeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/recipe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            return await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .ToListAsync();
        }

        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<Recipe>> AddRecipe([FromBody] RecipeDTO recipeDto)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
                return Unauthorized("Invalid token");

            int userId = int.Parse(userIdClaim.Value);

            var recipe = new Recipe
            {
                Title = recipeDto.Title,
                Content = recipeDto.Content,
                CreatedBy = userId, // ✅ Set the foreign key here
                RecipeIngredients = new List<RecipeIngredient>()
            };

            foreach (var ingredientDto in recipeDto.RecipeIngredients)
            {
                var ingredient = await _context.Ingredients
                    .FirstOrDefaultAsync(i => i.Name == ingredientDto.Name);

                if (ingredient == null)
                {
                    ingredient = new Ingredient { Name = ingredientDto.Name };
                    _context.Ingredients.Add(ingredient);
                    await _context.SaveChangesAsync();
                }

                recipe.RecipeIngredients.Add(new RecipeIngredient
                {
                    Ingredient = ingredient
                });
            }

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecipes), new { id = recipe.Id }, recipe);
        }

        [HttpGet("favorites")]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetUserFavoriteRecipes()
        {
            // Step 1: Get current user ID from JWT
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
                return Unauthorized("Invalid token");

            int userId = int.Parse(userIdClaim.Value);


            // Step 2: Query favorite recipes for the user
            var favoriteRecipes = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Recipe)
                    .ThenInclude(r => r.RecipeIngredients)
                        .ThenInclude(ri => ri.Ingredient)
                .Select(f => f.Recipe)
                .ToListAsync();

            return Ok(favoriteRecipes);
        }


        [HttpPost("favorites")]
        public async Task<IActionResult> AddFavorite([FromBody] RecipeDTO recipeDto)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null) return Unauthorized("Invalid token");

            int userId = int.Parse(userIdClaim.Value);

            var existingRecipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .FirstOrDefaultAsync(r => r.Title == recipeDto.Title);

            if (existingRecipe == null)
            {
                var newRecipe = new Recipe
                {
                    Title = recipeDto.Title,
                    Content = recipeDto.Content,
                    CreatedBy = userId,
                    RecipeIngredients = new List<RecipeIngredient>()
                };

                foreach (var name in recipeDto.Ingredients)
                {
                    var ingredient = await _context.Ingredients
                        .FirstOrDefaultAsync(i => i.Name == name);

                    if (ingredient == null)
                    {
                        ingredient = new Ingredient { Name = name };
                        _context.Ingredients.Add(ingredient);
                        await _context.SaveChangesAsync(); // ensures Ingredient.Id is populated
                    }

                    newRecipe.RecipeIngredients.Add(new RecipeIngredient
                    {
                        IngredientId = ingredient.Id // ✅ set by ID
                    });
                }

                _context.Recipes.Add(newRecipe);
                await _context.SaveChangesAsync();

                existingRecipe = newRecipe;
            }

            bool alreadyFavorite = await _context.Favorites.AnyAsync(f =>
                f.UserId == userId && f.RecipeId == existingRecipe.Id);

            if (alreadyFavorite)
                return BadRequest("Recipe already in favorites.");

            var favorite = new Favorite
            {
                UserId = userId,
                RecipeId = existingRecipe.Id
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok("Recipe added to favorites.");
        }
        [HttpDelete("favorites/{recipeId}")]
        public async Task<IActionResult> RemoveFavorite(int recipeId)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
                return Unauthorized("Invalid token");

            int userId = int.Parse(userIdClaim.Value);

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.RecipeId == recipeId);

            if (favorite == null)
                return NotFound("Favorite not found.");

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok("Favorite removed.");
        }




    }
}