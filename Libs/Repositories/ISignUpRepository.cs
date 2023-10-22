using Libs.Modelss;
using Microsoft.AspNetCore.Identity;

namespace Libs.Repositories
{
    public interface ISignUpRepository
    {
        public Task<IdentityResult> SignUpAsync(SignUpModel model);
    }
}
