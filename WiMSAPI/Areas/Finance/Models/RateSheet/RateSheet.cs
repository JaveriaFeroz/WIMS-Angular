using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class RateSheet : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RateSheetId { get; set; }
        public string StorerGroupName { get; set; }
        public string WHName { get; set; }
        public string PCName { get; set; }
        public string KAMName { get; set; }
        public string CalendarName { get; set; }
        public decimal MinInvAmount { get; set; } = 0;
        public DateTime? ExpiryDate { get; set; } 
        public bool IsActive { get; set; } = true;
        public List<RateSheet_Storage> Storage { get; set; } = new List<RateSheet_Storage>();
        public List<RateSheet_Handling> Handling { get; set; } = new List<RateSheet_Handling>();
        public List<RateSheet_Accessorial> FixedAccessorial { get; set; } = new List<RateSheet_Accessorial>();
        public List<RateSheet_Accessorial> VariableAccessorial { get; set; } = new List<RateSheet_Accessorial>();
        public List<RateSheet_ProjectRemarks> ProjectRemarks { get; set; } = new List<RateSheet_ProjectRemarks>();
        public List<RateSheet_Storage_ExLoc> ExemptedSL { get; set; } = new List<RateSheet_Storage_ExLoc>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public RateSheet()
        {
        }
        #endregion

        #region internal methods
        internal static RateSheet Get(short rateSheetId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheetById"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    using (RateSheet rs = new RateSheet())
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            rs.StorerGroupName = dr["StorerGroupName"].ToString();                           
                            rs.RateSheetId = rateSheetId;
                            rs.PCName = dr["PCName"].ToString();
                            rs.KAMName = dr["KAMName"].ToString();
                            rs.MinInvAmount = Convert.ToDecimal(dr["MinInvAmount"]);
                            rs.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            rs.ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]);
                            rs.CalendarName = dr["CalendarName"].ToString();
                            rs.Footer = new agFooter(dr);
                            #region Grid data
                            rs.Storage = RateSheet_Storage.Get(rs.RateSheetId.Value);
                            rs.Handling = RateSheet_Handling.Get(rs.RateSheetId.Value);
                            rs.FixedAccessorial = RateSheet_Accessorial.GetFixed(rs.RateSheetId.Value);
                            rs.VariableAccessorial = RateSheet_Accessorial.GetVariable(rs.RateSheetId.Value);
                            rs.ProjectRemarks = RateSheet_ProjectRemarks.Get(rs.RateSheetId.Value);
                            rs.ExemptedSL = RateSheet_Storage_ExLoc.Get(rs.RateSheetId.Value);
                            #endregion
                            return rs;
                        }
                        else
                            return null;
                    }
                }
            }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}