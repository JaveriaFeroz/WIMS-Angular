using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class ControlJob_Detail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public int? CJId { get; set; }
        //public short WHId { get; set; }
        //public string WHName { get; set; }
        public short? StorerGroupId { get; set; }
        public string StorerGroupName { get; set; }
        public short PCId { get; set; }
        public string PCName { get; set; }
        public string RevenueJobNo { get; set; }
        public string CostJobNo { get; set; }
        //public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        //public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public ControlJob_Detail()
        {
        }
        #endregion

        #region internal methods
        internal static List<ControlJob_Detail> Get(short periodId)
        {
            List<ControlJob_Detail> details = new List<ControlJob_Detail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetControlJobsByPeriod"))
            {
                db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, periodId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new ControlJob_Detail
                            {
                                //WHId = Convert.ToInt16(dr["WHId"]),
                                //WHName = dr["WHName"].ToString(),
                                //CJId = agHelper.iDBNull(dr["CJId"]),
                                StorerGroupId = Convert.ToInt16(dr["StorerGroupId"]),
                                StorerGroupName = dr["StorerGroupName"].ToString(),
                                PCId = Convert.ToInt16(dr["PCId"]),
                                PCName = dr["PCName"].ToString(),
                                RevenueJobNo = dr["RevenueJobNo"].ToString(),
                                CostJobNo = dr["CostJobNo"].ToString()
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(short periodId, List<ControlJob_Detail> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (ControlJob_Detail cjd in agHelper.GetEdits(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveControlJob"))
                    {                        
                        db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, periodId);
                        //db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, cjd.WHId);
                        db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, cjd.StorerGroupId);
                        db.AddInParameter(dbCommand, "PCId", SqlDbType.VarChar, cjd.PCId);
                        db.AddInParameter(dbCommand, "RevenueJobNo", SqlDbType.VarChar, cjd.RevenueJobNo);
                        db.AddInParameter(dbCommand, "CostJobNo", SqlDbType.VarChar, cjd.CostJobNo);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        //db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (cjd ? "D" : (cjd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}