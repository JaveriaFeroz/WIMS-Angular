using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Models.WHInvoice
{
    public class WHInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
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

                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadCWInvoiceNo");
                    db.AddInParameter(dbCommand, "lst", SqlDbType.Structured, dt);

                    int res = db.ExecuteNonQuery(dbCommand, transaction);
                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // Implement proper disposal if needed
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}