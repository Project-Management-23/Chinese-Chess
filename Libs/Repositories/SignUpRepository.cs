using Libs.Entity;
using Libs.Modelss;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Libs.Repositories
{
    public class SignUpRepository : ISignUpRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration configuration;

        public SignUpRepository(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
        }

        public async Task<IdentityResult> SignUpAsync(SignUpModel model)
        {
            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                UserName = model.UserName
            };

            if (user.Email!.ToLower().StartsWith("admin"))
            {
                await _userManager.CreateAsync(user, model.Password);
                return await _userManager.AddToRoleAsync(user, "ADMIN");
            }
            else
            {
                await _userManager.CreateAsync(user, model.Password);
                return await _userManager.AddToRoleAsync(user, "User");
            }
        }
    }
}
