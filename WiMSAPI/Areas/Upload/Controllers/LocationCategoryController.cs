using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Areas.Upload.Models;
using WiMSAPI.Areas.Upload.Models.LocationCategory;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Upload/[controller]")]
    public class LocationCategoryController : Controller
    {
        [HttpPost]
        public IActionResult Post([FromBody] List<LocationCategory> lst)
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
                
                LocationCategory.Save(lst, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "SaveOrder" }); }
        }
    }
}
