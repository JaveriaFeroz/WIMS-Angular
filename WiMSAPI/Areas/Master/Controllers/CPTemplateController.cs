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
    public class CPTemplateController : Controller
    {
        //[HttpGet]
        //public IActionResult Get()
        //{
        //    try
        //    {
        //        return Ok(CPTemplates.Get(Session.GetUserId(HttpContext)));
        //    }
        //    catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "GetList" }); }
        //}

        [HttpGet("{pcId}")]
        public IActionResult Get(short pcId)
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
                return Ok(CPTemplate.Get(pcId));
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = ex.Message, FieldName = "Get" }); }
        }

        [HttpPost]
        public IActionResult Post([FromBody] CPTemplate ct)
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
                return Ok( CPTemplate.Save(ct, Session.GetUserId(HttpContext)));
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
                    //lstWarehouse = Warehouses.Get(Session.GetUserId(HttpContext)),
                    lstProfitCenter = ProfitCenters.Get(Session.GetUserId(HttpContext)),
                    lstCostHead = CostHeads.Get(),
                    lstSupplier = Suppliers.Get()
                });
            }
            catch (Exception ex) { return Conflict(new ErrorModel { Message = "GetLookups Error: " + ex.Message, FieldName = "GetLookup" }); }
        }      
    }
}