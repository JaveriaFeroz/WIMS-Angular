using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public partial class ProfitCenters : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties        
        public short PCId { get; set; }
        public string PCCode { get; set; }
        public string PCName { get; set; }
        public string WHName { get; set; }
        [Browsable(false)]
        public short WHId { get; set; }
        #endregion

        #region constructor
        public ProfitCenters()
        {
        }
        #endregion

        #region internal methods
        internal static List<ProfitCenters> Get(string userId, bool activeOnly = true)
        {
            return get("GetProfitCenters", userId, activeOnly);
        }

        //internal static List<ProfitCenters> GetForCP(string userId, bool activeOnly = true)
        //{
        //    return get("GetProfitCentersForCP", userId, activeOnly);
        //}
        #endregion

        #region private methods
        private static List<ProfitCenters> get(string spName, string userId, bool activeOnly = true)
        {
            List<ProfitCenters> profitcenters = new List<ProfitCenters>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            profitcenters.Add(new ProfitCenters
                            {
                                PCId = Convert.ToInt16(dr["PCId"]),
                                PCCode = dr["PCCode"].ToString(),
                                PCName = dr["PCName"].ToString(),
                                WHName = dr["WHName"].ToString(),
                                WHId = Convert.ToInt16(dr["WHId"])
                            });
                        }
                    }
                }
            }
            return profitcenters;
        }
        #endregion

        #region Dispose member
        public void Dispose()
        {
        }
        #endregion
    }   
}