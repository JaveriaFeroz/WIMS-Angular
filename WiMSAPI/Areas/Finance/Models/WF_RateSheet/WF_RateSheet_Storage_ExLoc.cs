using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class WF_RateSheet_Storage_ExLoc : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WELId { get; set; }
        public short? ELId { get; set; }
        public short? LCId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_Storage_ExLoc()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_Storage_ExLoc> Get(int formId)
        {
            List<WF_RateSheet_Storage_ExLoc> exempted = new List<WF_RateSheet_Storage_ExLoc>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_Storage_ExLocCategory"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            exempted.Add(new WF_RateSheet_Storage_ExLoc
                            {
                                WELId = agHelper.sDBNull(dr["WELId"]),
                                ELId = agHelper.sDBNull(dr["ELId"]),
                                LCId = Convert.ToInt16(dr["LCId"]),
                                Action = dr["Action"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return exempted;
        }

        internal static bool Save(int formId, List<WF_RateSheet_Storage_ExLoc> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Storage_ExLoc rsel in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_Storage_ExLocCategory"))
                    {
                        db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                        db.AddInParameter(dbCommand, "WELId", SqlDbType.SmallInt, rsel.WELId);
                        db.AddInParameter(dbCommand, "ELId", SqlDbType.SmallInt, rsel.ELId);
                        db.AddInParameter(dbCommand, "LCId", SqlDbType.SmallInt, rsel.LCId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rsel.Delete ? "D" : (rsel.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }

        internal static List<WF_RateSheet_Storage_ExLoc> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_Storage_ExLoc> exempted = new List<WF_RateSheet_Storage_ExLoc>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Storage_ExLocCategory"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            exempted.Add(new WF_RateSheet_Storage_ExLoc
                            {
                                //RSSId = Convert.ToInt16(dr["RSSId"]),
                                ELId = Convert.ToInt16(dr["ELId"]),
                                LCId = Convert.ToInt16(dr["LCId"]),
                                Add = false,
                            });
                        }
                    }
                }
            }
            return exempted;
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}
