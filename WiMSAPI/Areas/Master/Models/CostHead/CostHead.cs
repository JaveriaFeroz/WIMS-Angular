using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class CostHead : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? HeadId { get; set; }   
        public string HeadName { get; set; }
        public bool IsActive { get; set; } = true;
        public string ChargeCode { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public CostHead()
        {
        }
        #endregion

        #region internal methods
        internal static CostHead Get(short id)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCostHeadById"))
            {
                db.AddInParameter(dbCommand, "HeadId", SqlDbType.SmallInt, id);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds!=null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        using (CostHead ch = new CostHead())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            ch.HeadId = Convert.ToInt16(dr["HeadId"]);
                            ch.HeadName = dr["HeadName"].ToString();
                            ch.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            ch.ChargeCode = dr["ChargeCode"].ToString();
                            ch.Footer = new agFooter(dr);
                            return ch;
                        }
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(CostHead ch, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCostHead"))
                {
                    db.AddInParameter(dbCommand, "HeadId", SqlDbType.SmallInt, ch.HeadId);
                    db.AddInParameter(dbCommand, "HeadName", SqlDbType.VarChar, ch.HeadName);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, ch.IsActive);
                    db.AddInParameter(dbCommand, "ChargeCode", SqlDbType.VarChar, ch.ChargeCode);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "updatedon", SqlDbType.DateTime, ch.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch(Exception) { throw; }
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