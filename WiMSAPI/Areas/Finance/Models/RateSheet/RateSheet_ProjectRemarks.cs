using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class RateSheet_ProjectRemarks : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSPRId { get; set; }
        public string WorkFlowName { get; set; }
        public string ProjectTitle { get; set; }
        public string ProjectName { get; set; }
        public string Remarks { get; set; }
        public decimal GSTRate { get; set; }
        #endregion

        #region constructor
        public RateSheet_ProjectRemarks()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<RateSheet_ProjectRemarks> Get(int rateSheetId)
        {
            List<RateSheet_ProjectRemarks> remarks = new List<RateSheet_ProjectRemarks>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_ProjectRemarks"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            remarks.Add(new RateSheet_ProjectRemarks
                            {
                                RSPRId = Convert.ToInt16(dr["RSPRId"]),
                                WorkFlowName = dr["WorkFlowName"].ToString(),
                                ProjectTitle = dr["ProjectTitle"].ToString(),
                                ProjectName = dr["ProjectName"].ToString(),
                                Remarks = dr["Remarks"].ToString(),
                                GSTRate = Convert.ToDecimal(dr["GSTRate"])
                            });
                        }
                    }
                }
            }
            return remarks;
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}
