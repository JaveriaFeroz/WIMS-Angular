using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using WiMSAPI.Master.Models;
using WiMSAPI.Operation.Models;

namespace WiMSAPI.Operation.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("WiMSAPI/Operation/[controller]")]
    public class ASNController : Controller
    {
        [HttpGet]
        public ASN Get(short whId, string storerKey, string asnNo)
        {
            return ASN.Get(whId, storerKey, asnNo, HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
        }

        [HttpPost]
        public IActionResult Post([FromBody] ASN asn)
        {
            try
            {
                ASN.Save(asn, HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                return Ok("Success");
            }
            catch (Exception) { throw; }
        }

        [HttpGet("[action]")]
        public JsonResult Lookups()
        {
            try
            {
                return Json(new
                {
                    success = true,
                    lstWarehouse = Warehouses.Get(HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value),
                    lstContainerType = ContainerTypes.Get(),
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "GetLookups Error: " + ex.Message });
            }
        }
    }
}