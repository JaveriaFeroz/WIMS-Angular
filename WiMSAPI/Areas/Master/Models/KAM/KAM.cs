using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class KAM : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? KAMId { get; set; } 
        public string KAMName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public KAM()
        {
        }
        #endregion

        #region internal methods
        internal static KAM Get(short id)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetKAMById"))
            {
                db.AddInParameter(dbCommand, "KAMId", SqlDbType.SmallInt, id);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new KAM
                        {
                            KAMId = id,
                            KAMName = dr["KAMName"].ToString(),
                            Email = dr["Email"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(KAM kam, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveKAM"))
                {
                    db.AddInParameter(dbCommand, "KAMId", SqlDbType.SmallInt, kam.KAMId);
                    db.AddInParameter(dbCommand, "KAMName", SqlDbType.VarChar, kam.KAMName);
                    db.AddInParameter(dbCommand, "Email", SqlDbType.VarChar, kam.Email);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, kam.IsActive);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, kam.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    } 
}