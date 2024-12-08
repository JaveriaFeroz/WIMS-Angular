using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Models.SO
{
    public class SOs : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string OrderKey { get; set; }
        public string StorerKey { get; set; }
        public string CustomerOrderNo { get; set; }
        public string ContainerType { get; set; }
        public string ContainerQty { get; set; }
        public string Warehouse { get; set; }
        public string ActualShipmentDate { get; set; }
        #endregion

        #region constructor
        public SOs()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(List<SOs> sos, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ListConvertDataTable converter = new ListConvertDataTable();
                    DataTable dt = converter.ToDataTable(sos);
                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadSO");
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
