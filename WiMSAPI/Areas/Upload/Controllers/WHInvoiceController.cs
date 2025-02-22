using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using WiMSAPI.Areas.Upload.Models.WHInvoice;
using WiMSAPI.Helper;
using System.Linq;
using OfficeOpenXml;



namespace WiMSAPI.Areas.Upload.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Upload/[controller]")]
    public class WHInvoiceController : Controller
    {
        private readonly IExcelProcessor _excelProcessor;

        public WHInvoiceController(IExcelProcessor excelProcessor)
        {
            _excelProcessor = excelProcessor;
        }

        [HttpPost("UploadExcel")]
        public IActionResult UploadExcel(IFormFile file)
        {
            try
            {
                string controllerName = RouteData.Values["controller"].ToString();
                if (Authentication.UserUpdatedSession(Session.GetUserId(HttpContext), controllerName))
                {
                    var sts = new System.Diagnostics.StackTrace();
                    var sf = sts.GetFrame(0);
                    var currentMethodName = sf.GetMethod();
                    return Conflict(new ErrorModel
                    {
                        Message = Session._message,
                        FieldName = currentMethodName.Name
                    });
                }

                if (file == null || file.Length == 0)
                {
                    throw new Exception("No file uploaded");
                }

                string fileExtension = Path.GetExtension(file.FileName);
                if (fileExtension != ".xlsx" && fileExtension != ".xls")
                {
                    throw new Exception("Invalid file format. Please upload an Excel file.");
                }

                using (var stream = file.OpenReadStream())
                {
                    var invoices = _excelProcessor.ProcessExcel(stream);
                    WHInvoice.Save(invoices, Session.GetUserId(HttpContext));
                }

                return Ok("Excel file processed successfully");
            }
            catch (Exception ex)
            {
                return Conflict(new ErrorModel
                {
                    Message = ex.Message,
                    FieldName = "UploadExcel"
                });
            }
        }

        // ... existing Post and Validate methods remain the same
    }
}

// 2. Excel Processor Interface
public interface IExcelProcessor
{
    List<WHInvoice> ProcessExcel(Stream fileStream);
}

// 3. Excel Processor Implementation


public class ExcelProcessor : IExcelProcessor
{
    public List<WHInvoice> ProcessExcel(Stream fileStream)
    {
        var invoices = new List<WHInvoice>();

        using (var package = new ExcelPackage(fileStream))
        {
            var worksheet = package.Workbook.Worksheets[0]; // First worksheet
            int rowCount = worksheet.Dimension.Rows;

            // Skip header row, start from row 2
            for (int row = 2; row <= rowCount; row++)
            {
                var invoiceNo = worksheet.Cells[row, 1].Text?.Trim();
                var cwInvoiceNo = worksheet.Cells[row, 2].Text?.Trim();

                if (!string.IsNullOrEmpty(invoiceNo) || !string.IsNullOrEmpty(cwInvoiceNo))
                {
                    invoices.Add(new WHInvoice
                    {
                        InvoiceNo = invoiceNo,
                        CwInvoiceNo = cwInvoiceNo
                    });
                }
            }
        }

        ValidateExcelData(invoices);
        return invoices;
    }

    private void ValidateExcelData(List<WHInvoice> invoices)
    {
        if (!invoices.Any())
        {
            throw new Exception("No valid data found in the Excel file");
        }

        var errors = new List<string>();
        var rowNumber = 2; // Starting from Excel row 2

        foreach (var invoice in invoices)
        {
            if (string.IsNullOrWhiteSpace(invoice.InvoiceNo))
            {
                errors.Add($"Row {rowNumber}: Invoice number is required");
            }
            if (string.IsNullOrWhiteSpace(invoice.CwInvoiceNo))
            {
                errors.Add($"Row {rowNumber}: CW Invoice number is required");
            }
            rowNumber++;
        }

        // Check for duplicates
        var duplicates = invoices
            .GroupBy(x => x.InvoiceNo)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key);

        if (duplicates.Any())
        {
            errors.Add($"Duplicate Invoice numbers found: {string.Join(", ", duplicates)}");
        }

        if (errors.Any())
        {
            throw new Exception($"Validation errors in Excel file:\n{string.Join("\n", errors)}");
        }
    }
}


