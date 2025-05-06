using ChefGeminiAPI.Helpers;
using ChefGeminiAPI.Data;
using ChefGeminiAPI.Models;
using ChefGeminiAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ChefGeminiAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public UserController(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        // POST: api/user/register
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict("Email already exists.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }

        // POST: api/user/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(UserLoginDto dto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Login || u.Username == dto.Login);

            if (existingUser == null || !VerifyPassword(dto.Password, existingUser.PasswordHash))
            {
                return Unauthorized("Invalid username/email or password.");
            }

            var token = _jwtHelper.GenerateToken(existingUser.Email, existingUser.Id, existingUser.Username);
            return Ok(new { token });
        }


        [HttpGet("me")]
        public async Task<ActionResult<object>> GetCurrentUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid token");

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }


        [HttpPut("me")]
        public async Task<ActionResult> UpdateCurrentUser(UserUpdateDto dto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid token");

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            user.Username = dto.Username ?? user.Username;
            user.Email = dto.Email ?? user.Email;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/user/exists/username/{username}
        // GET: api/user/exists/username?username={username}
        [HttpGet("exists/username")]
        public async Task<IActionResult> CheckUsernameExists([FromQuery] string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Username is required.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.Username == username);
            return Ok(new { exists = userExists });
        }

        // GET: api/user/exists/email?email={email}
        [HttpGet("exists/email")]
        public async Task<IActionResult> CheckEmailExists([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var emailExists = await _context.Users.AnyAsync(u => u.Email == email);
            return Ok(new { exists = emailExists });
        }


        // ✅ Simple hash methods (not for production, use ASP.NET Identity or BCrypt in real apps)
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }

        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            return HashPassword(inputPassword) == storedHash;
        }
    }
}
