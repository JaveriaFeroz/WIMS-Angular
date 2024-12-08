using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class RateSheets : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties      
        public short RateSheetId { get; set; }      
        public string StorerGroupName { get; set; }      
        //public string WHName { get; set; }      
        public string PCName { get; set; }       
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public RateSheets()
        {
        }
        #endregion

        #region internal methods
        internal static List<RateSheets> Get(string userId)
        {
            try
            {
                List<RateSheets> ratesheets = new List<RateSheets>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheets"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                ratesheets.Add(new RateSheets
                                {
                                    RateSheetId = Convert.ToInt16(dr["RateSheetId"]),
                                    StorerGroupName = dr["StorerGroupName"].ToString(),                                   
                                    PCName = dr["PCName"].ToString(),
                                    IsActive = Convert.ToBoolean(dr["IsActive"])
                                });
                            }
                        }
                    }
                }
                return ratesheets;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposal implementation
        public void Dispose()
        {
        }
        #endregion
    }
}
