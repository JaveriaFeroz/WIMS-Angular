using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class WF_RateSheet : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? FormId { get; set; }
        //public int? RateSheetId { get; set; }
        public short? StorerGroupId { get; set; }
        //public short? WHId { get; set; }
        public short? PCId { get; set; }
        public short? KAMId { get; set; }
        public short? CalendarId { get; set; }
        public decimal MinInvAmount { get; set; } = 0;
        public DateTime? ExpiryDate { get; set; } 
        public bool IsActive { get; set; } = true;
        public List<WF_RateSheet_Storage> Storage { get; set; } = new List<WF_RateSheet_Storage>();
        public List<WF_RateSheet_Handling> Handling { get; set; } = new List<WF_RateSheet_Handling>();
        public List<WF_RateSheet_Accessorial> FixedAccessorial { get; set; } = new List<WF_RateSheet_Accessorial>();
        public List<WF_RateSheet_Accessorial> VariableAccessorial { get; set; } = new List<WF_RateSheet_Accessorial>();
        public List<WF_RateSheet_ProjectRemarks> ProjectRemarks { get; set; } = new List<WF_RateSheet_ProjectRemarks>();
        public List<WF_RateSheet_Storage_ExLoc> ExemptedSL { get; set; } = new List<WF_RateSheet_Storage_ExLoc>();
        public short? StateId { get; set; }
        public string StateName { get; set; }
        public string Owner { get; set; }
        //public bool Approved { get; set; } = false;
        //public bool Rejected { get; set; } = false;
        public bool Completed { get; set; } = false;
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public WF_RateSheet()
        {
        }
        #endregion

        #region internal methods
        internal static WF_RateSheet Get(short formId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheetById"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    using (WF_RateSheet rs = new WF_RateSheet())
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            rs.FormId = formId;
                            rs.StorerGroupId = Convert.ToInt16(dr["StorerGroupId"]);
                            //rs.WHId = Convert.ToInt16(dr["WHId"]);
                            rs.PCId = Convert.ToInt16(dr["PCId"]);
                            rs.KAMId = Convert.ToInt16(dr["KAMId"]);
                            rs.MinInvAmount = Convert.ToDecimal(dr["MinInvAmount"]);
                            rs.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            rs.ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]);
                            rs.CalendarId = Convert.ToInt16(dr["InvCalendarId"]);
                            rs.StateId = Convert.ToInt16(dr["StateId"]);
                            rs.Owner = dr["Owner"].ToString();
                            rs.Completed = Convert.ToBoolean(dr["Completed"]);
                            rs.Footer = new agFooter(dr);
                            #region load Grid data
                            rs.Storage = WF_RateSheet_Storage.Get(rs.FormId.Value);
                            rs.Handling = WF_RateSheet_Handling.Get(rs.FormId.Value);
                            rs.FixedAccessorial = WF_RateSheet_Accessorial.GetFixed(rs.FormId.Value);
                            rs.VariableAccessorial = WF_RateSheet_Accessorial.GetVariable(rs.FormId.Value);
                            rs.ProjectRemarks = WF_RateSheet_ProjectRemarks.Get(rs.FormId.Value);
                            rs.ExemptedSL = WF_RateSheet_Storage_ExLoc.Get(rs.FormId.Value);
                            #endregion
                            return rs;
                        }
                        else
                            return null;
                    }
                }
            }
        }

        internal static WF_RateSheet GetExisting(short sgId, short pcId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheetByStorerId"))
            {
                db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, sgId);
                db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    using (WF_RateSheet rs = new WF_RateSheet())
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            int rateSheetId = Convert.ToInt32(dr["RateSheetId"]);
                            rs.StorerGroupId = sgId;
                            //rs.WHId = whId;
                            rs.PCId = pcId;
                            rs.KAMId = agHelper.sDBNull(dr["KAMId"]);
                            rs.MinInvAmount = Convert.ToDecimal(dr["MinInvAmount"]);
                            rs.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            rs.ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]);
                            rs.CalendarId = agHelper.sDBNull(dr["InvCalendarId"]);
                            rs.Footer = new agFooter(dr);
                            #region load Grid data
                            rs.Storage = WF_RateSheet_Storage.GetExisting(rateSheetId);
                            rs.Handling = WF_RateSheet_Handling.GetExisting(rateSheetId);
                            rs.FixedAccessorial = WF_RateSheet_Accessorial.GetExistingFixed(rateSheetId);
                            rs.VariableAccessorial = WF_RateSheet_Accessorial.GetExistingVariable(rateSheetId);
                            rs.ProjectRemarks = WF_RateSheet_ProjectRemarks.GetExisting(rateSheetId);
                            rs.ExemptedSL = WF_RateSheet_Storage_ExLoc.GetExisting(rateSheetId);
                            #endregion
                            return rs;
                        }
                        else
                            return null;
                    }
                }
            }
        }

        internal static bool Save(WF_RateSheet rs, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, rs.FormId);
                    //db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rs.RateSheetId);
                    db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, rs.StorerGroupId);
                    //db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, rs.WHId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.VarChar, rs.PCId);
                    db.AddInParameter(dbCommand, "MinInvAmount", SqlDbType.Decimal, rs.MinInvAmount);
                    db.AddInParameter(dbCommand, "KAMId", SqlDbType.SmallInt, rs.KAMId);
                    db.AddInParameter(dbCommand, "ExpiryDate", SqlDbType.DateTime, rs.ExpiryDate);
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, rs.IsActive);
                    db.AddInParameter(dbCommand, "InvCalendarId", SqlDbType.SmallInt, rs.CalendarId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, rs.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newFormId", SqlDbType.SmallInt, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    rs.FormId = Convert.ToInt16(dbCommand.Parameters["@newFormId"].Value);
                    WF_RateSheet_Storage.Save(rs.FormId.Value, rs.Storage, userId, transaction);
                    WF_RateSheet_Storage_ExLoc.Save(rs.FormId.Value, rs.ExemptedSL, userId, transaction);
                    WF_RateSheet_Handling.Save(rs.FormId.Value, rs.Handling, userId, transaction);
                    WF_RateSheet_Accessorial.SaveFixed(rs.FormId.Value, rs.FixedAccessorial, userId, transaction);
                    WF_RateSheet_Accessorial.SaveVariable(rs.FormId.Value, rs.VariableAccessorial, userId, transaction);
                    WF_RateSheet_ProjectRemarks.Save(rs.FormId.Value, rs.ProjectRemarks, userId, transaction);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception) {
                transaction.Rollback();
                throw;
            }
        }

        internal static bool Submit(Submission sub, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitWF_RateSheet");
                db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, sub.FormId);
                db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, sub.Comments);
                db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.Int, sub.StateId);
                db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, sub.Owner);
                db.AddInParameter(dbCommandDetail, "Approved", SqlDbType.Bit, sub.Approved);
                db.AddInParameter(dbCommandDetail, "Rejected", SqlDbType.Bit, sub.Rejected);
                db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.Bit, sub.Completed);
                db.ExecuteNonQuery(dbCommandDetail);
            }
            catch (Exception) { throw; }
            return true;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}