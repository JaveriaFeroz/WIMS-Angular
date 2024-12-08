using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class RateSheet_Storage_ExLoc : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSSId { get; set; }
        public string LCName { get; set; }
        #endregion

        #region constructor
        public RateSheet_Storage_ExLoc()
        {
        }
        #endregion

        #region internal methods
        internal static List<RateSheet_Storage_ExLoc> Get(int rateSheetId)
        {
            List<RateSheet_Storage_ExLoc> exempted = new List<RateSheet_Storage_ExLoc>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Storage_ExLocCategory"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            exempted.Add(new RateSheet_Storage_ExLoc
                            {
                                RSSId = Convert.ToInt16(dr["ELId"]),
                                LCName = dr["LCName"].ToString()
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
