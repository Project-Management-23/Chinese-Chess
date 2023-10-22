using Libs.Modelss;
using Libs.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace WebChineseChess.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginRepository authRepo;

        public LoginController(ILoginRepository repo)
        {
            authRepo = repo;
        }

        [HttpPost("loginacc")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var authResult = await authRepo.AuthenAsync(model);
            if (authResult == null)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                token = authResult.Token,
                user = authResult.User
            });
        }
    }
}
