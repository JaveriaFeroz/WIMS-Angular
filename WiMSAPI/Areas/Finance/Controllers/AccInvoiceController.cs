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
    public class AccInvoiceController : Controller
    {
        [HttpGet]
        [Route("{workflowId}")]
        public IActionResult Get(short workflowId)
        {
            try
            {
                return Ok(AccInvoices.Get((agEnums.WorkFlow)workflowId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet]
        [Route("{invoiceNo}/{workflowId}")]
        public IActionResult Get(string invoiceNo, short workflowId)
        {
            try
            {
                return Ok(AccInvoice.Get(HttpUtility.UrlDecode(invoiceNo), workflowId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetFixed/{sgId}/{pcId}/{tranDate}")]
        public IActionResult GetFixed(short sgId, short pcId, DateTime tranDate)
        {
            try
            {
                return Ok(AccInvoiceDetail.GetFixed(sgId, pcId, tranDate));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetVariable/{sgId}/{pcId}/{tranDate}")]
        public IActionResult GetVariable(short sgId, short pcId, DateTime tranDate)
        {
            try
            {
                return Ok(AccInvoiceDetail.GetVariable(sgId, pcId, tranDate));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetDefaultGST/{sgId}/{pcId}/{workFlowId}")]
        public IActionResult GetDefaultGST(short sgId, short pcId, short workFlowId)
        {
            try
            {
                return Ok(AccInvoice.GetDefaultGST(sgId, pcId, workFlowId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] AccInvoice ai)
        {
            try
            {
                AccInvoice.Save(ai, Session.GetUserId(HttpContext));
                return Ok(new { newInvoiceNo = ai.InvoiceNo, newInvoiceId = ai.InvoiceId, Owner = Session.GetUserId(HttpContext) });
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
                    lstStorerGroup = StorerGroups.Get(),
                    lstProfitCenter = ProfitCenters.Get(Session.GetUserId(HttpContext)),
                    lstCharge = AccessorialCharges.Get(),
                    lstNoteCharge = ChargeTypes.Get(),
                    lstUoM = UoMs.Get(),
                });
            }
            catch (Exception ex)
            {
                return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookup" });
            }
        }

        [HttpPost]
        [Route("Submit")]
        public IActionResult Submit([FromBody] Submission sub)
        {
            try
            {
                return Ok(AccInvoice.Submit(sub, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Submit Invoice" }); }
        }

    }
}