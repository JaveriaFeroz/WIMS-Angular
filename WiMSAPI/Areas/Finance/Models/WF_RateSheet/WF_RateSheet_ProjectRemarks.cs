using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class WF_RateSheet_ProjectRemarks : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WPRId { get; set; }
        public short? PRId { get; set; }
        public short? WorkFlowId { get; set; }
        public string ProjectTitle { get; set; }
        public string ProjectName { get; set; }
        public string Remarks { get; set; }
        public decimal GSTRate { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_ProjectRemarks()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_ProjectRemarks> Get(int formId)
        {
            List<WF_RateSheet_ProjectRemarks> remarks = new List<WF_RateSheet_ProjectRemarks>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_ProjectRemarks"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            remarks.Add(new WF_RateSheet_ProjectRemarks
                            {
                                WPRId = agHelper.sDBNull(dr["WPRId"]),
                                PRId = agHelper.sDBNull(dr["PRId"]),
                                WorkFlowId = Convert.ToInt16(dr["WorkFlowId"]),
                                ProjectTitle = dr["ProjectTitle"].ToString(),
                                ProjectName = dr["ProjectName"].ToString(),
                                Remarks = dr["Remarks"].ToString(),
                                GSTRate = Convert.ToDecimal(dr["GSTRate"]),
                                Action = dr["Action"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return remarks;
        }

        internal static bool Save(int formId, List<WF_RateSheet_ProjectRemarks> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_ProjectRemarks rspr in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_ProjectRemarks"))
                    {   
                        db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                        db.AddInParameter(dbCommand, "WPRId", SqlDbType.SmallInt, rspr.WPRId);
                        db.AddInParameter(dbCommand, "PRId", SqlDbType.Int, rspr.PRId);
                        db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, rspr.WorkFlowId);
                        db.AddInParameter(dbCommand, "ProjectTitle", SqlDbType.VarChar, rspr.ProjectTitle);
                        db.AddInParameter(dbCommand, "ProjectName", SqlDbType.VarChar, rspr.ProjectName);
                        db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, rspr.Remarks);
                        db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Float, rspr.GSTRate);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rspr.Delete ? "D" : (rspr.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }

        internal static List<WF_RateSheet_ProjectRemarks> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_ProjectRemarks> remarks = new List<WF_RateSheet_ProjectRemarks>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_ProjectRemarks"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            remarks.Add(new WF_RateSheet_ProjectRemarks
                            {
                                //DetailId = Convert.ToInt16(dr["DetailId"]),
                                PRId = Convert.ToInt16(dr["RSPRId"]),
                                WorkFlowId = Convert.ToInt16(dr["WorkFlowId"]),
                                ProjectTitle = dr["ProjectTitle"].ToString(),
                                ProjectName = dr["ProjectName"].ToString(),
                                Remarks = dr["Remarks"].ToString(),
                                GSTRate = Convert.ToDecimal(dr["GSTRate"]),
                                Add = false
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
