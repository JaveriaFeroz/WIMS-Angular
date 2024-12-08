using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Claims;

namespace WiMSAPI.Helper
{
    public class Session
    {
        internal static string _message = "Forbidden Access!";
        #region internal methods
        internal static string GetUserId(HttpContext _hc)
        {
            HttpContextAccessor ha = new HttpContextAccessor();
            return _hc.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        }

        #endregion
    }
}
