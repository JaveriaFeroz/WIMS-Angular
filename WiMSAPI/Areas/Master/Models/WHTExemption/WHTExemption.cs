using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class WHTExemption : IDisposable
    {
        #region private fields
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public fields
        public short? ExemptionId { get; set; }
        public DateTime? DateFrom { get; set; } = DateTime.Now;
        public DateTime? DateTo { get; set; } = DateTime.Now.AddDays(365);
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public WHTExemption()
        {
        }
        #endregion

        #region internal methods
        internal static WHTExemption Get(short exemptionId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWHTExemptionById"))
            {
                db.AddInParameter(dbCommand, "WHTExemptionId", SqlDbType.SmallInt, exemptionId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        //using (WHTExemption te = new WHTExemption())
                        //{
                            DataRow dr = ds.Tables[0].Rows[0];
                        return new WHTExemption
                        {
                            ExemptionId = exemptionId,
                            DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                            DateTo = Convert.ToDateTime(dr["DateTo"]),
                            Footer = new agFooter(dr)
                        };
                        //}
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(WHTExemption wht, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWHTExemption"))
                {
                    db.AddInParameter(dbCommand, "WHTExemptionId", SqlDbType.SmallInt, wht.ExemptionId);
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, wht.DateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, wht.DateTo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, wht.Footer.UpdatedOn);
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

        }
        #endregion
    }   
}