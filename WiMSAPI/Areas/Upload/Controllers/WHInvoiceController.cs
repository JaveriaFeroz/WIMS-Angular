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
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using Microsoft.Extensions.Configuration;

namespace WiMSAPI.Areas.Upload.Controllers
{
    [Authorize(Policy = "ValidAccessToken")]
    [Produces("application/json")]
    [Route("Upload/[controller]")]
    public class WHInvoiceController : Controller
    {
        private readonly IExcelProcessor _excelProcessor;
        private readonly IConfiguration _configuration;

        public WHInvoiceController(IExcelProcessor excelProcessor, IConfiguration configuration)
        {
            _excelProcessor = excelProcessor;
            _configuration = configuration;
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

            Console.WriteLine($"Excel File Processing: {rowCount} rows found.");

            // Start from row 2 (skip header)
            for (int row = 2; row <= rowCount; row++)
            {
                Console.WriteLine($"\nProcessing Row {row}:");

                var invoiceNoCell = worksheet.Cells[row, 1];
                var cwInvoiceNoCell = worksheet.Cells[row, 2];

                // Log details of cell values and their types
                Console.WriteLine($"Invoice No:");
                Console.WriteLine($"  Text: '{invoiceNoCell.Text}'");
                Console.WriteLine($"  Value: '{invoiceNoCell.Value}'");
                Console.WriteLine($"  Type: {invoiceNoCell.Value?.GetType()}");
                Console.WriteLine($"  Format: {invoiceNoCell.Style.Numberformat.Format}");

                Console.WriteLine($"CW Invoice No:");
                Console.WriteLine($"  Text: '{cwInvoiceNoCell.Text}'");
                Console.WriteLine($"  Value: '{cwInvoiceNoCell.Value}'");
                Console.WriteLine($"  Type: {cwInvoiceNoCell.Value?.GetType()}");
                Console.WriteLine($"  Format: {cwInvoiceNoCell.Style.Numberformat.Format}");

                // Convert Invoice No and CW Invoice No to string, handling format issues
                string invoiceNo = ConvertCellToString(invoiceNoCell);
                string cwInvoiceNo = ConvertCellToString(cwInvoiceNoCell);

                Console.WriteLine($"Converted Invoice No: '{invoiceNo}'");
                Console.WriteLine($"Converted CW Invoice No: '{cwInvoiceNo}'");

                // Null checks
                if (string.IsNullOrWhiteSpace(invoiceNo) || string.IsNullOrWhiteSpace(cwInvoiceNo))
                {
                    Console.WriteLine($"Skipping row {row}: Empty or invalid cell values.");
                    continue;
                }

                invoices.Add(new WHInvoice
                {
                    InvoiceNo = invoiceNo,
                    CwInvoiceNo = cwInvoiceNo
                });
            }
        }

        ValidateExcelData(invoices);
        return invoices;
    }
    private string ConvertCellToString(ExcelRange cell)
    {
        if (cell.Value == null) return string.Empty;

        // Fix: Handle invoice numbers wrongly converted to dates
        if (cell.Value is DateTime dateValue)
        {
            return cell.Text.Trim();
        }

        // Fix: Ensure numbers are treated as text
        if (cell.Value is double || cell.Value is int || cell.Value is decimal)
        {
            return cell.Text.Trim();
        }

        return cell.Text.Trim();
    }

    //private string ConvertCellToString(ExcelRange cell)
    //{
    //    // Case 1: Cell value is null
    //    if (cell.Value == null)
    //    {
    //        return string.Empty;
    //    }

    //    // Case 2: Cell contains a DateTime (Excel often converts formats like XX/XXXXX to dates)
    //    if (cell.Value is DateTime dateValue)
    //    {
    //        // First try to get the original text display value
    //        if (!string.IsNullOrEmpty(cell.Text) && cell.Text.Contains("/"))
    //        {
    //            Console.WriteLine($"Using display text for date-formatted cell: '{cell.Text}'");
    //            return cell.Text.Trim();
    //        }

    //        // If that doesn't work, try to reconstruct the original format
    //        // This handles cases where Excel converts AH25/00394 to a date
    //        string originalText = cell.Text;

    //        // Check if it looks like our invoice format (contains slashes, dashes, etc.)
    //        if (originalText.Contains("/") || originalText.Contains("-"))
    //        {
    //            return originalText.Trim();
    //        }

    //        // If all else fails, use the string representation but log the issue
    //        Console.WriteLine($"WARNING: Date conversion fallback for cell at {cell.Address}");
    //        return cell.Value.ToString().Trim();
    //    }

    //    // Case 3: Cell contains a numeric value (Excel sometimes treats invoice numbers as numbers)
    //    if (cell.Value is double || cell.Value is int || cell.Value is decimal)
    //    {
    //        // Use the display text which preserves formatting like leading zeros
    //        if (!string.IsNullOrEmpty(cell.Text))
    //        {
    //            return cell.Text.Trim();
    //        }

    //        // Fallback to toString with culture-invariant formatting
    //        return Convert.ToString(cell.Value, System.Globalization.CultureInfo.InvariantCulture).Trim();
    //    }

    //    // Case 4: For all other types, prefer the cell.Text if available
    //    if (!string.IsNullOrEmpty(cell.Text))
    //    {
    //        return cell.Text.Trim();
    //    }

    //    // Final fallback: just use ToString()
    //    return cell.Value.ToString().Trim();
    //}

    private void ValidateExcelData(List<WHInvoice> invoices)
    {
        if (!invoices.Any())
        {
            throw new Exception("No valid data found in the Excel file.");
        }

        var errors = new List<string>();
        int rowNumber = 2;

        foreach (var invoice in invoices)
        {
            Console.WriteLine($"Validating Row {rowNumber}:");
            Console.WriteLine($"  Invoice No: {invoice.InvoiceNo}");
            Console.WriteLine($"  CW Invoice No: {invoice.CwInvoiceNo}");

            // Check Invoice No format - make sure it's not empty
            if (string.IsNullOrWhiteSpace(invoice.InvoiceNo))
            {
                errors.Add($"Row {rowNumber}: Invoice Number is empty");
            }

            // Check CW Invoice No format - should start with PK and have digits
            if (!System.Text.RegularExpressions.Regex.IsMatch(invoice.CwInvoiceNo, @"^PK\d+$"))
            {
                errors.Add($"Row {rowNumber}: Invalid CW Invoice Number format: {invoice.CwInvoiceNo}");
            }

            rowNumber++;
        }

        if (errors.Any())
        {
            throw new Exception($"Validation errors in Excel file:\n{string.Join("\n", errors)}");
        }
    }
}