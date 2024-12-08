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
    public class PeriodController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                //string controllerName = RouteData.Values["controller"].ToString(); if (Authentication.UserUpdatedSession(Session.GetUserId(HttpContext), controllerName))
                //{
                //    var st = new System.Diagnostics.StackTrace();
                //    var sf = st.GetFrame(0);
                //    var currentMethodName = sf.GetMethod();
                //    return Conflict(new ErrorModel { Message = Session._message, FieldName = currentMethodName.Name });
                //}
                return Ok(Period.Get());
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Close()
        {
            try
            {
                string controllerName = RouteData.Values["controller"].ToString(); if (Authentication.UserUpdatedSession(Session.GetUserId(HttpContext), controllerName))
                {
                    var st = new System.Diagnostics.StackTrace();
                    var sf = st.GetFrame(0);
                    var currentMethodName = sf.GetMethod();
                    return Conflict(new ErrorModel { Message = Session._message, FieldName = currentMethodName.Name });
                }
                Period.Close(Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Close" }); }
        }

        //[HttpGet]
        //[Route("GetPeriod")]
        //public IActionResult GetPeriod()
        //{
        //    try
        //    {
        //        return Ok(Periods.GetCurrentPeriod());
        //    }
        //    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPeriod" }); }
        //}
    }
}