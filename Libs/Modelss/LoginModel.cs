using System.ComponentModel.DataAnnotations;

namespace Libs.Modelss
{
    public class LoginModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
