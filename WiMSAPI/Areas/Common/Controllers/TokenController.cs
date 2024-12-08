using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Common.Controllers
{
    [Route("Common/[controller]")]
    [ApiController]
    public class TokenController : Controller
    {
        #region private properties
        private readonly IConfiguration _config;
        #endregion

        #region constructor
        public TokenController(IConfiguration config)
        {
            _config = config;
        }
        #endregion

        #region internal methods
        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreateToken([FromBody] UserCredential _credential)
        {
            IActionResult response;// = Unauthorized();
            try
            {
                UserCredential _uc = Authentication.AuthenticateUser(_credential.UserId, _credential.Password);
                if (_uc.AuthStatus == agEnums.AuthenticationStatus.Successful)
                {
                    Authentication.SaveUserUpdatedSession(_credential.UserId);
                    var tokenString = buildToken(_uc);
                    response = Ok(new { accessToken = tokenString, message = _uc.AuthStatus.ToString(), status = Microsoft.AspNetCore.Http.StatusCodes.Status200OK });
                }
                else if (_uc.AuthStatus == agEnums.AuthenticationStatus.ForcePasswordChange)
                {
                    var tokenString = buildToken(_uc);
                    response = Ok(new { accessToken = tokenString, message = _uc.AuthStatus.ToString(), status = Microsoft.AspNetCore.Http.StatusCodes.Status200OK });
                }
                else
                    response = new ObjectResult(new { accessToken = string.Empty, message = _uc.AuthStatus.ToString(), status = Microsoft.AspNetCore.Http.StatusCodes.Status406NotAcceptable });
            }
            catch (Exception ex)
            {
                var error = new
                {
                    accessToken = string.Empty,
                    message = ex.Message,
                    status = Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError
                };
                response = new ObjectResult(error);
            }
            return response;
        }
        #endregion

        #region private methods
        public string buildToken(UserCredential _uc)
        {
            var _claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, _uc.UserId),
                new Claim(JwtRegisteredClaimNames.GivenName, _uc.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Audience"], _claims,
              expires: DateTime.Now.AddMinutes(300),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion

        
    }
}
