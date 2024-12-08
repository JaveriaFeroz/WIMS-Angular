using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Common.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Common/[controller]")]
    public class RecipientController : ControllerBase
    {
        [HttpGet]
        [Route("GetHistory/{workflowId}/{formId}")]
        public IActionResult GetHistory(short workflowId, int formId)
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
                return Ok(FormHistory.Get(workflowId, formId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetHistory" }); }
        }

        [HttpGet]
        [Route("GetCreator/{workFlowId}/{formId}")]
        public IActionResult GetCreator(short workFlowId, int formId)
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
                return Ok(new { recipient = Recipient.GetOwner(formId, (agEnums.WorkFlow)workFlowId) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetForm_Creator" }); }
        }

        [HttpGet]
        [Route("GetCPRecipients/{provisionId}/{stateid}")]
        public IActionResult GetCPRecipients(int provisionId, short stateId)
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
                List<Recipient> recipient = Recipient.GetCPRecipients(provisionId, stateId, out short nextStateId);
                return Ok(new { recipient, nextStateId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetCPRecipients" }); }
        }

        //[HttpGet]
        //[Route("GetDNRecipients/{invoiceId}/{stateid}")]
        //public IActionResult GetDNRecipients(int invoiceId, short stateId)
        //{
        //    try
        //    {
        //        List<Recipient> recipient = Recipient.GetDNRecipients(invoiceId, stateId, out short nextStateId);
        //        return Ok(new { recipient, nextStateId });
        //    }
        //    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetDNRecipients" }); }
        //}

        [HttpGet]
        [Route("GetWFRateSheetRecipients/{formId}/{stateId}")]
        public IActionResult GetWFRateSheetRecipient(int formId, short stateId)
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
                List<Recipient> recipient = Recipient.GetWFRateSeheetRecipients(formId, stateId, out short nextStateId);
                return Ok(new { recipient, nextStateId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetRateSheetRecipients" }); }
        }

        [HttpGet]
        [Route("GetAccInvoiceRecipients/{formId}/{workflowId}/{stateId}")]
        public IActionResult GetAccInvoiceRecipients(int formId, short workflowId, short stateId)
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
                List<Recipient> recipient = Recipient.GetAccInvoiceRecipients(formId, workflowId, stateId, out short nextStateId);
                return Ok(new { recipient, nextStateId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetAccInvoiceRecipients" }); }
        }

        [HttpGet]
        [Route("GetInvoiceRecipients/{formId}/{stateId}")]
        public IActionResult GetInvoiceRecipients(int formId, short stateId)
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
                List<Recipient> recipient = Recipient.GetInvoiceRecipients(formId, stateId, out short nextStateId);
                return Ok(new { recipient, nextStateId });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetInvoiceRecipients" }); }
        }

        //[HttpGet]
        //[Route("GetCPOwner/{provisionId}")]
        //public IActionResult GetCPOwner(int provisionId)
        //{
        //    return Ok(new { recipient = Recipient.GetOwner(provisionId, agEnums.WorkFlow.CostProvision)  });
        //}
        //[HttpGet]
        //[Route("GetDNOwner/{invoiceId}")]
        //public IActionResult GetDNOwner(int invoiceId)
        //{
        //    return Ok(new { recipient = Recipient.GetOwner(invoiceId, agEnums.WorkFlow.DebitNote) });
        //}
        //[HttpGet]
        //[Route("GetWFRateSheetOwner/{formId}")]
        //public IActionResult GetWFRateSheetOwner(int formId)
        //{            
        //    return Ok(new { recipient = Recipient.GetOwner(formId, agEnums.WorkFlow.RateSheet) });
        //}
        //[HttpGet]
        //[Route("GetAdHocInvoiceOwner/{formId}")]
        //public IActionResult GetAdHocInvoiceOwner(int formId)
        //{
        //    return Ok(new { recipient = Recipient.GetOwner(formId, agEnums.WorkFlow.AdhocInvoice) });
        //}
        //[HttpGet]
        //[Route("GetInvoiceOwner/{formId}")]
        //public IActionResult GetInvoiceOwner(int formId)
        //{           
        //    return Ok(new { recipient = Recipient.GetOwner(formId, agEnums.WorkFlow.CoreInvoice) });
        //}
    }
}