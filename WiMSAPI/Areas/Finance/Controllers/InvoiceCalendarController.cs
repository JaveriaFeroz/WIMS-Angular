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
    public class InvoiceCalendarController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(InvCalendars.Get());
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{calendarId}")]
        public IActionResult Get(short calendarId)
        {
            try
            {
                return Ok(InvCalendar.Get(calendarId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] InvCalendar ic)
        {
            try
            {
                InvCalendar.Save(ic, Session.GetUserId(HttpContext));
                return Ok("Ok");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
        {
            try
            {
                return Ok(new
                {
                    lstPeriod = Periods.GetPeriods()
                });
            }
            catch (Exception ex)
            {
                return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookup" });
            }
        }

        //[HttpGet("[action]")]
        //public JsonResult Lookups()
        //{
        //    try
        //    {
        //        return Json(new
        //        {
        //            success = true,
        //            lstPeriod = Periods.Get()
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookup" });
        //    }
        //}
    }
}