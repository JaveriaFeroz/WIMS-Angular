using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Web;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Areas.Finance.Models;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class InvoiceController : Controller
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
                return Ok(Invoices.Get(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("GetPending")]
        public IActionResult GetPending()
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
                return Ok(Invoices.GetPendingInvoices(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("Validate/{storerGroupId}/{pcId}/{dateFrom}/{dateTo}")]
        public IActionResult Validate(short storerGroupId, short pcId, DateTime datefrom, DateTime dateto)
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
                return Ok(InvoiceValidation.Validate(storerGroupId, pcId, datefrom, dateto, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Validate" }); }
        }

        [HttpGet]
        [Route("GetCalendar/{storerGroupId}/{pcId}/{inclPastPeriod}")]
        public IActionResult GetCalendar(short storerGroupId, short pcId, bool inclPastPeriod)
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
                return Ok(Invoice.GetCalendar(storerGroupId, pcId, inclPastPeriod, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetCalendar" }); }
        }

        //[HttpPost]
        //[Route("GenerateInvoice")]
        //public IActionResult GenerateInvoice([FromBody] Invoice inv)
        //{
        //    try
        //    {
        //        Invoice.Generate(inv, Session.GetUserId(HttpContext));
        //        return Ok("Success");
        //    }
        //    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GenerateInvoice" }); }
        //}

        [HttpPost]
        [Route("UnInvoice/{Invoiceno}/{Acknowledge}")]
        public IActionResult UnInvoice(string Invoiceno, bool Acknowledge)
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
                Invoice.UnInvoice(HttpUtility.UrlDecode(Invoiceno), Acknowledge, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "UnInvoice" }); }
        }

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
                return Ok(new
                {
                    lstStorerGroup = StorerGroups.Get(),
                    //lstWarehouse = Warehouses.Get(Session.GetUserId(HttpContext)),
                    lstProfitCenter = ProfitCenters.Get(Session.GetUserId(HttpContext))
                });
            }
            catch (Exception ex)
            {
                return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookup" });
            }
        }

        [HttpGet("{FormId}")]
        public IActionResult Get(short FormId)
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
                return Ok(Invoice.Get(FormId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [Route("GetShortInfo/{invoiceNo}")]
        public IActionResult GetShortInfo(string invoiceNo)
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
                return Ok(InvoiceInfo.Get(HttpUtility.UrlDecode(invoiceNo), Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetShortInfo" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Invoice inv)
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
                Invoice.Save(inv, Session.GetUserId(HttpContext));
                return Ok(new { newFormId = inv.FormId, Owner = Session.GetUserId(HttpContext) });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
        }

        [HttpPost]
        [Route("Submit")]
        public IActionResult Submit([FromBody] Submission sub)
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
                Invoice.SubmitInvoice(sub, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Submit" }); }
        }
    }
}