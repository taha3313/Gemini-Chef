using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChefGeminiAPI.Helpers
{


        public class JwtHelper
        {
            private readonly IConfiguration _configuration;

            public JwtHelper(IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public string GenerateToken(string userEmail, int userId, string username)
            {
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, userEmail),
                new Claim("userId", userId.ToString()),
                new Claim("username", username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(2),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
        }
    }

