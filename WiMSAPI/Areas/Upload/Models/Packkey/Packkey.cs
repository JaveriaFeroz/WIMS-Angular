using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Models.Packkey
{
    public class Packkey : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string PackKey { get; set; }
        public string Each { get; set; }
        public string InnerPack  { get; set; }
        public string Cases  { get; set; }
        public string Pallet  { get; set; }
        #endregion

        #region constructor
        public Packkey()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(List<Packkey> sos, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ListConvertDataTable converter = new ListConvertDataTable();
                    DataTable dt = converter.ToDataTable(sos);
                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadPackkey");
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
