using Libs.Entity;
using Libs.Modelss;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Libs.Repositories
{
    public class LoginRepository : ILoginRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public LoginRepository(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public class AuthResult
        {
            public string Token { get; set; }
            public CustomUserDetails User { get; set; }
        }

        public class CustomUserDetails
        {
            public string Id { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
        }

        public async Task<AuthResult> AuthenAsync(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return null;
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, "user")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["JWT:ValidIssuer"],
                _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            var auResult = new AuthResult
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                User = new CustomUserDetails
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email
                }
            };

            return auResult;
        }
    }
}
