using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class UserManagementController : Controller
    {
        [HttpGet]
        public IActionResult Get()
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
                return Ok(Users.Get());
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{userId}")]
        public IActionResult Get(string userId)
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
                return Ok(UserProfile.Get(userId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserProfile up)
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
                return Ok(UserProfile.Save(up, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }
    }
}