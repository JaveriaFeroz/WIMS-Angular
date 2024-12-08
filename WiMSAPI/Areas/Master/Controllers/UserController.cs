using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Master/[controller]")]
    public class UserController : Controller
    {
        [HttpGet]
        [Route("GetAccess")]
        public IActionResult GetAccess()
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
                return Ok(UserAccess.Get(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetAccess" }); }
        }

        [HttpGet]
        [Route("GetMenu")]
        public IActionResult GetMenu()
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
                return Ok(Menu.Get(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetMenu" }); }
        }

        [HttpGet]
        [Route("GetUserRole")]
        public IActionResult GetUserRole()
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
                return Ok(UserRole.Get(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetUserRole" }); }
        }

        [HttpGet]
        [Route("ChangePassword")]
        public IActionResult ChangePassword([FromBody] PasswordChange _pc)
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
                if (PasswordChange.ChangePassword(Session.GetUserId(HttpContext), _pc.OldPassword, _pc.NewPassword))
                    return Json(new { success = true, message = "Password Changed Successfully!" });
                else
                    return Json(new { success = false, message = "An Error occurred while attempting password change!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [Route("SendPassword")]
        [HttpPost]
        public IActionResult SendPassword()
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
                UserProfile.SendPassword(Session.GetUserId(HttpContext));
                return Json(new { success = true, message = "Password sent to email Id associated with this user!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}