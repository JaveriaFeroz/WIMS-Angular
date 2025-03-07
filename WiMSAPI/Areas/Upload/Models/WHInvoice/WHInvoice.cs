using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace WiMSAPI.Areas.Upload.Models.WHInvoice
{
    public class WHInvoice : IDisposable
    {
        #region private properties
        
        private static readonly SqlDatabase db = new SqlDatabase(
            new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build()
                .GetConnectionString("ArsConnection"));
        #endregion

        #region public properties
        public string InvoiceNo { get; set; }
        public string CwInvoiceNo { get; set; }
        #endregion

        #region constructor
        public WHInvoice()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(List<WHInvoice> invoices, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ListConvertDataTable converter = new ListConvertDataTable();
                    DataTable dt = converter.ToDataTable(invoices);

                    // Debugging: Log DataTable contents
                    Console.WriteLine("DataTable Contents:");
                    foreach (DataRow row in dt.Rows)
                    {
                        Console.WriteLine($"InvoiceNo: {row["InvoiceNo"]}, CwInvoiceNo: {row["CwInvoiceNo"]}");
                    }

                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadCWInvoiceNo");
                    db.AddInParameter(dbCommand, "lst", SqlDbType.Structured, dt);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.NVarChar, userId);

                    try
                    {
                        int res = db.ExecuteNonQuery(dbCommand, transaction);
                        transaction.Commit();
                        return true;
                    }
                    catch (SqlException ex)
                    {
                        // Log the detailed error
                        Console.WriteLine($"SQL Error: {ex.Message}");
                        Console.WriteLine($"Error Number: {ex.Number}");
                        Console.WriteLine($"Line Number: {ex.LineNumber}");
                        Console.WriteLine($"Procedure: {ex.Procedure}");

                        throw new Exception($"Database error: {ex.Message}", ex);
                    }
                }
                catch (Exception ex)
                {
                    // Log the general exception
                    Console.WriteLine($"General Error: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                    transaction.Rollback();
                    throw;
                }
            }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}



//using Microsoft.Practices.EnterpriseLibrary.Data;
//using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.Common;
//using WiMSAPI.Helper;
//namespace WiMSAPI.Areas.Upload.Models.WHInvoice
//{
//    public class WHInvoice : IDisposable
//    {
//        #region private properties
//        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
//        #endregion
//        #region public properties
//        public string InvoiceNo { get; set; }
//        public string CwInvoiceNo { get; set; }
//        #endregion
//        #region constructor
//        public WHInvoice()
//        {
//        }
//        #endregion
//        #region internal methods
//        internal static bool Save(List<WHInvoice> invoices, string userId)
//        {
//            using (DbConnection dbconnection = db.CreateConnection())
//            {
//                dbconnection.Open();
//                DbTransaction transaction = dbconnection.BeginTransaction();
//                try
//                {
//                    ListConvertDataTable converter = new ListConvertDataTable();
//                    DataTable dt = converter.ToDataTable(invoices);
//                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadCWInvoiceNo");
//                    db.AddInParameter(dbCommand, "lst", SqlDbType.Structured, dt);
//                    int res = db.ExecuteNonQuery(dbCommand, transaction);
//                    transaction.Commit();
//                    return true;
//                }
//                catch (Exception)
//                {
//                    transaction.Rollback();
//                    throw;
//                }
//            }
//        }
//        #endregion
//        #region IDisposable Members
//        public void Dispose()
//        {

//            GC.SuppressFinalize(this);
//        }
//        #endregion
//    }
//}