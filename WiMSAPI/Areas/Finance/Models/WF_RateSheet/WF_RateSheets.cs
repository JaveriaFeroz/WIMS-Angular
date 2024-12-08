using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class WF_RateSheets : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties      
        public int FormId { get; set; }
        public string StorerGroupName { get; set; }      
        //public string WHName { get; set; }      
        public string PCName { get; set; }       
        public string StateName { get; set; }
        #endregion

        #region constructor
        public WF_RateSheets()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheets> Get(string userId)
        {
            try
            {
                List<WF_RateSheets> WF_RateSheets = new List<WF_RateSheets>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheets"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                WF_RateSheets.Add(new WF_RateSheets
                                {
                                    FormId = Convert.ToInt32(dr["FormId"]),
                                    StorerGroupName = dr["StorerGroupName"].ToString(),
                                    //WHName = dr["WHName"].ToString(),
                                    PCName = dr["PCName"].ToString(),
                                    StateName = dr["StateName"].ToString()
                                });
                            }
                        }
                    }
                }
                return WF_RateSheets;
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
