using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Operation.Models
{
    public class CostProvisions : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int ProvisionId { get; set; }      
        public string WHName { get; set; }
        public string PCName { get; set; }
        public string PeriodName { get; set; }
        public string Owner { get; set; }
        #endregion

        #region constructor
        public CostProvisions()
        {

        }
        #endregion

        #region internal methods
        internal static List<CostProvisions> Get(string userId)
        {
            List<CostProvisions> provisions = new List<CostProvisions>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCostProvisions"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            provisions.Add(new CostProvisions
                            {
                                ProvisionId = Convert.ToInt32(dr["ProvisionId"]),
                                WHName = dr["WHName"].ToString(),
                                PCName = dr["PCName"].ToString(),
                                PeriodName = dr["PeriodName"].ToString(),
                                Owner = dr["Owner"].ToString()
                            });
                        }
                    }
                }
            }
            return provisions;
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}