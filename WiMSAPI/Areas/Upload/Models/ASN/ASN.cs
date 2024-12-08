using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Models.ASN
{
    public class ASNs : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string ReceiptKey { get; set; }
        public string StorerKey { get; set; }
        public string ExternReceiptKey { get; set; }
        public string ContainerType { get; set; }
        public string ContainerQty { get; set; }
        public string WhseID { get; set; }
        public string ReceiptDate { get; set; }
        #endregion

        #region constructor
        public ASNs()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(List<ASNs> sos, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ListConvertDataTable converter = new ListConvertDataTable();
                    DataTable dt = converter.ToDataTable(sos);
                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadASN");
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
