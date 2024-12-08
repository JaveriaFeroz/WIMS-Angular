using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Areas.Upload.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Upload/[controller]")]
    public class STController : Controller
    {
        [HttpGet]
        [Route("GetLookups")]
        public IActionResult GetLookups()
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
                return Ok(new { lstWarehouse = Warehouses.Get(Session.GetUserId(HttpContext)) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "GetLookups Error: " + ex.Message });
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] List<st> lstst)
        {
            try
            {
                string controllerName = RouteData.Values["controller"].ToString(); if (Authentication.UserUpdatedSession(Session.GetUserId(HttpContext), controllerName))
                {
                    var sts = new System.Diagnostics.StackTrace();
                    var sf = sts.GetFrame(0);
                    var currentMethodName = sf.GetMethod();
                    return Conflict(new ErrorModel { Message = Session._message, FieldName = currentMethodName.Name });
                }
                if (lstst != null && lstst.Count > 0)
                {
                    lstst.RemoveAll(x => x.Lottable01.Contains("Storerkey"));
                }
                st.Save(lstst, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveOrder" }); }
        }
    }
}
