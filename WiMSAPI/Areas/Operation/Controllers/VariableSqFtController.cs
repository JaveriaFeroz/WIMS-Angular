using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Areas.Operation.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Operation.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Operation/[controller]")]
    public class VariableSqFtController : Controller
    {
        [HttpGet("{storerGroupId}/{pcId}/{dateFrom}/{dateTo}/{storageTypeId}")]
        public IActionResult Get(short storerGroupId, short pcId, DateTime datefrom, DateTime dateto, short storageTypeId)
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
                return Ok(VariableSqFt.Get(storerGroupId, pcId, datefrom, dateto, storageTypeId, Session.GetUserId(HttpContext)));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] VariableSqFt sqFt)
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
                VariableSqFt.Save(sqFt, Session.GetUserId(HttpContext));
                return Ok("Success");
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Save" }); }
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
                    lstStorerGroup = StorerGroups.GetForVariableSqFt(),
                    lstStorageType = StorageTypes.Get(),
                    lstProfitCenter = ProfitCenters.Get(Session.GetUserId(HttpContext))
                });
            }
            catch (Exception ex) {
                return Conflict(new ErrorModel { Message = "GetLookups: " + ex.Message, FieldName = "GetLookups" });
            }
        }
    }
}