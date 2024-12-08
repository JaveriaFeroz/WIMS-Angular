using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Operation.Models
{
    public class CostProvision : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ProvisionId { get; set; }
        //public short? WHId { get; set; }
        public short? PCId { get; set; }
        public short? PeriodId { get; set; }
        public string PeriodName { get; set; }
        public short? StateId { get; set; }
        public string StateName { get; set; }
        public string Owner { get; set; }
        public bool Completed { get; set; } = false;
        public List<CostProvisionDetail> Details { get; set; } = new List<CostProvisionDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public CostProvision()
        {
        }
        #endregion

        #region internal methods
        internal static CostProvision Get(int provisionId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCostProvisionById"))
            {
                db.AddInParameter(dbCommand, "ProvisionId", SqlDbType.SmallInt, provisionId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        //using (CostProvision cp = new CostProvision())
                        //{
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new CostProvision
                        {
                            ProvisionId = provisionId,
                            //WHId = Convert.ToInt16(dr["WHId"]),
                            PCId = Convert.ToInt16(dr["PCId"]),
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            StateId = Convert.ToInt16(dr["StateId"]),
                            Owner = dr["Owner"].ToString(),
                            Completed = Convert.ToBoolean(dr["Completed"]),
                            Footer = new agFooter(dr),
                            Details = CostProvisionDetail.Get(provisionId)
                        };
                          //  return cp;
                        //}
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(CostProvision cp, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCostProvision"))
                {
                    db.AddInParameter(dbCommand, "ProvisionId", SqlDbType.Int, cp.ProvisionId);
                    //db.AddInParameter(dbCommand, "WarehouseId", SqlDbType.SmallInt, cp.WHId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.VarChar, cp.PCId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.NVarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, cp.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newProvisionId", SqlDbType.Int, 32);
                    dbconnection.Open();
                    DbTransaction transaction = dbconnection.BeginTransaction();
                    try
                    {
                        db.ExecuteNonQuery(dbCommand, transaction);
                        cp.ProvisionId = Convert.ToInt32(dbCommand.Parameters["@newProvisionId"].Value);
                        CostProvisionDetail.Save(cp.ProvisionId.Value, cp.Details, userId, transaction);
                        if (cp.StateId == (int)agEnums.MECPState.New)
                        {
                            cp.StateId = (int)agEnums.MECPState.Saved;
                            cp.Footer.CreatedBy = userId;
                            cp.Owner = userId;
                            cp.Footer.UpdatedBy = userId;
                        }
                        transaction.Commit();
                        return true;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        internal static bool Submit(Submission submission, string userId)
        {
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitCostProvision"))
                {
                    db.AddInParameter(dbCommandDetail, "ProvisionId", SqlDbType.Int, submission.FormId);
                    db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, submission.Comments);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, submission.StateId);
                    db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, submission.Owner);
                    db.AddInParameter(dbCommandDetail, "Remarks", SqlDbType.VarChar, submission.Remarks);
                    db.AddInParameter(dbCommandDetail, "Completed", SqlDbType.Bit, submission.Completed);
                    db.ExecuteNonQuery(dbCommandDetail);
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //_rwbothercharges = null;
        }
        #endregion
    }
}