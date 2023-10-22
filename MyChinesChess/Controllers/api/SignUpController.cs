using Libs.Modelss;
using Libs.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace WebChineseChess.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignUpController : ControllerBase
    {
        private readonly ISignUpRepository suRepo;

        public SignUpController(ISignUpRepository repo)
        {
            suRepo = repo;
        }

        [HttpPost("signupacc")]
        public async Task<IActionResult> SignUp(SignUpModel signUpModel)
        {
            var result = await suRepo.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok(result.Succeeded);
            }

            return Unauthorized();
        }
    }
}
