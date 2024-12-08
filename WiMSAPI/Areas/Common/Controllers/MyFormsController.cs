using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Common.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Common/[controller]")]
    //[PageAuthorization]
    public class MyFormsController : ControllerBase
    {
        
        [Route("ActiveForms/{workflowId}")]
        public IActionResult ActiveForms(short workflowId)
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
                return Ok(MyForm.GetActive(workflowId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetPending" }); }
        }

        [HttpGet]
        [Route("SentForms/{workflowId}")]
        public IActionResult SentForms(short workflowId)
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
                return Ok(MyForm.GetSent(workflowId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetSent" }); }
        }

        [HttpGet]
        [Route("CompletedForms/{workflowId}")]
        public IActionResult CompletedForms(short workflowId)
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
                return Ok(MyForm.GetCompleted(workflowId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetCompleted" }); }
        }

        //[HttpGet]
        //[Route("History/{workflowId}/{formId}")]
        //public IActionResult GetHisotry(short workflowId, int formId)
        //{
        //    try
        //    {
        //        return Ok(FormHistory.Get(workflowId, formId));
        //    }
        //    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetHistory" }); }
        //}
    }
}