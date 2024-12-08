using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Models.ITRN
{
    public class ITRN : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string Storerkey { get; set; }
        public string Sku { get; set; }
        public string TranType { get; set; }  
        public string SourceKey { get; set; }  
        public string PackKey { get; set; }  
        public string UoM { get; set; }  
        public string Quantity { get; set; }  
        public string Warehouse { get; set; }  
        public string PalletId { get; set; }  
        public DateTime TransactionDate { get; set; }  
        public string Is10x { get; set; }  
        #endregion

        #region constructor
        public ITRN()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(List<ITRN> sos, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ListConvertDataTable converter = new ListConvertDataTable();
                    DataTable dt = converter.ToDataTable(sos);
                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadITRN");
                    db.AddInParameter(dbCommand, "lst", SqlDbType.Structured, dt);
                    int res = db.ExecuteNonQuery(dbCommand);
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

        #region private methods
       
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
        }
        #endregion
    }
}
