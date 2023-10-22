using Libs.Modelss;
using static Libs.Repositories.LoginRepository;

namespace Libs.Repositories
{
    public interface ILoginRepository
    {
        public Task<AuthResult> AuthenAsync(LoginModel model);
    }
}
