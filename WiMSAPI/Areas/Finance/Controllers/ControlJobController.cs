using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using WiMSAPI.Areas.Finance.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class ControlJobController : Controller
    {
        [HttpGet("{periodId}")]
        public IActionResult Get(short periodId)
        {
            try
            {
                return Ok(ControlJob.Get(periodId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] ControlJob controlJob)
        {
            try
            {
                return Ok(ControlJob.Save(controlJob, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}