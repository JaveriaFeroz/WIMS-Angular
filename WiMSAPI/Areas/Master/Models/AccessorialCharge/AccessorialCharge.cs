using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class AccessorialCharge : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? ChargeId { get; set; }  
        public string ChargeName { get; set; }
        public bool IsActive { get; set; } = true;
        public string ChargeCode { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public AccessorialCharge()
        {
        }
        #endregion

        #region internal methods
        internal static AccessorialCharge Get(short id)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessorialChargeById"))
            {
                db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, id);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new AccessorialCharge
                        {
                            ChargeId = Convert.ToInt16(dr["ChargeId"]),
                            ChargeName = dr["ChargeName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            ChargeCode = dr["ChargeCode"].ToString(),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(AccessorialCharge ac, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAccessorialCharge"))
            {
                db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, ac.ChargeId);
                db.AddInParameter(dbCommand, "ChargeName", SqlDbType.VarChar, ac.ChargeName);
                db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, ac.IsActive);
                db.AddInParameter(dbCommand, "ChargeCode", SqlDbType.VarChar, ac.ChargeCode);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "updatedon", SqlDbType.DateTime, ac.Footer.UpdatedOn);
                db.ExecuteNonQuery(dbCommand);
                return true;
            }
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