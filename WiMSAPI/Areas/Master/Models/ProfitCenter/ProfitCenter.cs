using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class ProfitCenter : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? PCId { get; set; }
        public string PCCode { get; set; }
        public string PCName { get; set; }
        public string DeptCode { get; set; }
        public short WHId { get; set; }
        public bool IsActive { get; set; } = true;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public ProfitCenter()
        {
        }
        #endregion

        #region internal methods
        internal static ProfitCenter Get(short pcId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetProfitCenterById"))
            {
                db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                            DataRow dr = ds.Tables[0].Rows[0];
                        return new ProfitCenter
                        {
                            PCId = pcId,
                            PCCode = dr["PCCode"].ToString(),
                            PCName = dr["PCName"].ToString(),
                            DeptCode = dr["DeptCode"].ToString(),
                            WHId = Convert.ToInt16(dr["WHId"]),
                            IsActive = Convert.ToBoolean(dr["IsActive"]),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(ProfitCenter pc, string userId)
        {
            using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SaveProfitCenter"))
            {
                db.AddInParameter(dbCommandDetail, "PCId", SqlDbType.SmallInt, pc.PCId);
                db.AddInParameter(dbCommandDetail, "PCCode", SqlDbType.VarChar, pc.PCCode);
                db.AddInParameter(dbCommandDetail, "PCName", SqlDbType.VarChar, pc.PCName);
                db.AddInParameter(dbCommandDetail, "DeptCode", SqlDbType.VarChar, pc.DeptCode);
                db.AddInParameter(dbCommandDetail, "WHId", SqlDbType.SmallInt, pc.WHId);
                db.AddInParameter(dbCommandDetail, "IsActive", SqlDbType.Bit, pc.IsActive);
                db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommandDetail, "UpdatedOn", SqlDbType.DateTime, pc.Footer.UpdatedOn);
                db.ExecuteNonQuery(dbCommandDetail);
                return true;
            }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }   
}