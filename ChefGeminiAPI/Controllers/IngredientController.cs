using ChefGeminiAPI.Models;
using ChefGeminiAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ChefGeminiAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IngredientController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ingredient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingredient>>> GetIngredients()
        {
            return await _context.Ingredients.ToListAsync();
        }

        // POST: api/ingredient
        [HttpPost]
        public async Task<ActionResult<Ingredient>> AddIngredient(Ingredient ingredient)
        {
            // Check if ingredient already exists
            var existingIngredient = await _context.Ingredients
                .FirstOrDefaultAsync(i => i.Name.ToLower() == ingredient.Name.ToLower());

            if (existingIngredient != null)
            {
                return Conflict("Ingredient already exists.");
            }

            _context.Ingredients.Add(ingredient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIngredients), new { id = ingredient.Id }, ingredient);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Ingredient>>> SearchIngredients([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query is required.");

            var results = await _context.Ingredients
                .Where(i => EF.Functions.Like(i.Name, $"%{query}%"))
                .ToListAsync();

            return Ok(results);
        }

    }
}
