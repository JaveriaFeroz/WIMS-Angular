using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class RateSheet_Storage_LocCategory : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSSId { get; set; }
        public string LCName { get; set; }
        public bool UPP { get; set; }
        #endregion

        #region constructor
        public RateSheet_Storage_LocCategory()
        {
        }
        #endregion

        #region internal methods
        internal static List<RateSheet_Storage_LocCategory> Get(int rateSheetId)
        {
            List<RateSheet_Storage_LocCategory> rssloccategories = new List<RateSheet_Storage_LocCategory>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Storage_LocCategory"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.Int, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            rssloccategories.Add(new RateSheet_Storage_LocCategory
                            {
                                RSSId = Convert.ToInt16(dr["RSSId"]),
                                LCName = dr["LCName"].ToString(),
                                UPP = Convert.ToBoolean(dr["UPP"])
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
