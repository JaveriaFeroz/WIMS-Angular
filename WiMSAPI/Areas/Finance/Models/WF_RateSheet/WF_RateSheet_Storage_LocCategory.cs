using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class WF_RateSheet_Storage_LocCategory : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WSLCId { get; set; }
        public short? WRSSId { get; set; }
        public short? SLCId { get; set; }
        public short? LCId { get; set; }
        public bool UPP { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; }
        #endregion

        #region constructor
        public WF_RateSheet_Storage_LocCategory()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_Storage_LocCategory> Get(int formId)
        {
            List<WF_RateSheet_Storage_LocCategory> rssloccategories = new List<WF_RateSheet_Storage_LocCategory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_Storage_LocCategory"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rssloccategories.Add(new WF_RateSheet_Storage_LocCategory
                            {
                                WSLCId = agHelper.sDBNull(dr["WSLCId"]),
                                WRSSId = Convert.ToInt16(dr["WRSSId"]),
                                SLCId = agHelper.sDBNull(dr["SLCId"]),
                                LCId = Convert.ToInt16(dr["LCId"]),
                                UPP = Convert.ToBoolean(dr["UPP"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return rssloccategories;
        }

        internal static bool Save(int srId, List<WF_RateSheet_Storage_LocCategory> detail, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Storage_LocCategory rsslc in agHelper.GetChanges(detail))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_Storage_LocCategory"))
                    {
                        db.AddInParameter(dbCommand, "WRSSId", SqlDbType.SmallInt, srId);
                        db.AddInParameter(dbCommand, "WSLCId", SqlDbType.SmallInt, rsslc.WSLCId);
                        db.AddInParameter(dbCommand, "SLCId", SqlDbType.Int, rsslc.SLCId);
                        db.AddInParameter(dbCommand, "LCId", SqlDbType.Int, rsslc.LCId);
                        db.AddInParameter(dbCommand, "UPP", SqlDbType.Bit, rsslc.UPP);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rsslc.Delete ? "D" : (rsslc.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }

        internal static List<WF_RateSheet_Storage_LocCategory> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_Storage_LocCategory> rssloccategories = new List<WF_RateSheet_Storage_LocCategory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Storage_LocCategory"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rssloccategories.Add(new WF_RateSheet_Storage_LocCategory
                            {
                                //DetailId = Convert.ToInt16(dr["DetailId"]),
                                WRSSId = Convert.ToInt16(dr["RSSId"]),
                                SLCId = Convert.ToInt16(dr["SLCId"]),
                                LCId = Convert.ToInt16(dr["LCId"]),
                                UPP = Convert.ToBoolean(dr["UPP"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return rssloccategories;
        }
        #endregion

        #region idisposable methods
        public void Dispose()
        {
        }
        #endregion
    }
}
