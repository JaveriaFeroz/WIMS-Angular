using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using WiMSAPI.Areas.Finance.Models;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Finance/[controller]")]
    public class GroupInvoiceController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Invoices.GetGroupInvoices(Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        }

        [HttpGet("{groupInvoiceNo}")]
        public IActionResult Get(string groupInvoiceNo)
        {
            try
            {
                return Ok(GroupInvoice.Get(groupInvoiceNo, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpGet]
        [Route("GetInvoicesForGrouping/{sgId}/{pcId}")]
        public IActionResult GetInvoicesForGrouping(short sgId, short pcId)
        {
            try
            {
                return Ok(GroupInvoiceDetail.GetForGrouping(sgId, pcId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] GroupInvoice gi)
        {
            try
            {
                GroupInvoice.Save(gi, Session.GetUserId(HttpContext));
                return Ok();
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
                    lstProfitCenter = ProfitCenters.Get(Session.GetUserId(HttpContext))
                });
            }
            catch (Exception ex)
            {
                return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetLookup" });
            }
        }
    }
}