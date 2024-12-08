using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class AccInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; } 
        public short? StorerGroupId { get; set; }
        public short PCId { get; set; }
        public string Remarks { get; set; }
        public decimal Amount { get; set; }
        public List<AccInvoiceDetail> Details { get; set; } = new List<AccInvoiceDetail>();
        public agFooter Footer { get; set; } = new agFooter();

        #region section specifically used for DR/CR note only
        public string RefInvoiceNo { get; set; }
        public string RefInvoiceDate { get; set; }
        public string RefPeriodName { get; set; }
        public string StorerGroupName { get; set; }
        public string PCName { get; set; }
        public List<DRCRDetail> PreviousDetails { get; set; } = new List<DRCRDetail>();
        public List<DRCRDetail> RevisedDetails { get; set; } = new List<DRCRDetail>();
        #region section specifically for Debit note submission and tracing
        public short? StateId { get; set; }
        public string StateName { get; set; }
        public string Owner { get; set; }
        public bool Completed { get; set; } = false;
        public decimal? GSTRate { get; set; }
        public short? WorkFlowId { get; set; }
        public bool Approved { get; set; } = false;
        public bool Rejected { get; set; } = false;
        #endregion
        #endregion
        #endregion

        #region constructor
        public AccInvoice()
        {
        }
        #endregion

        #region internal methods
        internal static AccInvoice Get(string invoiceNo, short workflowId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccInvoiceByNo"))
            {
                db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invoiceNo);
                db.AddInParameter(dbCommand, "workflowId", SqlDbType.TinyInt, workflowId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        AccInvoice ai = new AccInvoice
                        {
                            InvoiceNo = invoiceNo,
                            InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                            InvoiceDate = Convert.ToDateTime(dr["InvoiceDate"]),
                            StorerGroupId = Convert.ToInt16(dr["StorerGroupId"]),
                            StorerGroupName = dr["StorerGroupName"].ToString(),
                            PCId = Convert.ToInt16(dr["PCId"]),
                            PCName = dr["PCName"].ToString(),
                            Remarks = dr["Remarks"].ToString(),
                            GSTRate = agHelper.dDBNull(dr["GSTRate"]),
                            Amount = Convert.ToDecimal(dr["InvoiceAmount"]),
                            RefInvoiceNo = dr["RefInvoiceNo"].ToString(),
                            RefInvoiceDate = dr["RefInvoiceDate"].ToString(),
                            RefPeriodName = dr["RefPeriodName"].ToString(),
                            StateId = agHelper.sDBNull(dr["StateId"]),
                            Owner = dr["Owner"].ToString(),
                            Completed = agHelper.NVL(dr["Completed"], true),
                            Footer = new agFooter(dr)
                        };

                        #region Grid data
                        if (workflowId == 5 || workflowId == 6)
                        {
                            List<DRCRDetail> drcrDetails = DRCRDetail.Get(ai.InvoiceId.Value);
                            ai.PreviousDetails = drcrDetails.Where(x => x.StateId == 1).ToList();
                            ai.RevisedDetails = drcrDetails.Where(x => x.StateId == 2).ToList();
                        }
                        else
                            ai.Details = AccInvoiceDetail.Get(ai.InvoiceId.Value);
                        #endregion

                        return ai;
                    }
                    else { return null; }
                }
            }
        }

        internal static bool Save(AccInvoice ai, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAccInvoice"))
            {
                db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, ai.InvoiceId);
                db.AddInParameter(dbCommand, "InvoiceDate", SqlDbType.DateTime, ai.InvoiceDate);
                db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, ai.StorerGroupId);
                db.AddInParameter(dbCommand, "PCId", SqlDbType.VarChar, ai.PCId);
                db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, ai.Remarks);
                if (agHelper.InList(ai.WorkFlowId.Value, 5, 6))
                {
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, ai.Amount);
                }
                else
                {
                    db.AddInParameter(dbCommand, "Amount", SqlDbType.Decimal, ai.Details.Sum(x => x.Amount));
                }
                db.AddInParameter(dbCommand, "RefInvoiceNo", SqlDbType.VarChar, ai.RefInvoiceNo);
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, ai.WorkFlowId);
                db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Decimal, ai.GSTRate);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ai.Footer.UpdatedOn);
                db.AddOutParameter(dbCommand, "NewInvoiceNo", SqlDbType.VarChar, 32);
                db.AddOutParameter(dbCommand, "NewInvoiceId", SqlDbType.Int, 32);

                using (DbConnection dbconnection = db.CreateConnection())
                {
                    dbconnection.Open();
                    DbTransaction transaction = dbconnection.BeginTransaction();
                    try
                    {
                        db.ExecuteNonQuery(dbCommand, transaction);
                        if (ai.InvoiceNo == null)
                        {
                            ai.InvoiceNo = dbCommand.Parameters["@NewInvoiceNo"].Value.ToString();
                        }
                        ai.InvoiceId = Convert.ToInt32(dbCommand.Parameters["@NewInvoiceId"].Value);

                        #region save invoice details
                        if (ai.RefInvoiceNo!= null)
                        {
                            DRCRDetail.Save(ai.InvoiceId.Value, ai, transaction);                           
                        }
                        else
                        {
                            AccInvoiceDetail.Save(ai.InvoiceId.Value, ai.Details, userId, transaction);
                        }

                        if(ai.WorkFlowId < 4 || ai.WorkFlowId == 6 )
                        {
                            Invoice.SetCompleted(ai.InvoiceId.Value, transaction);
                        }
                        #endregion

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw ex;
                    }
                }
            }
        }

        internal static decimal GetDefaultGST(short sgId, short pcId, short workFlowId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDefaultGST"))
            {
                db.AddInParameter(dbCommand, "StorerGroupid", SqlDbType.SmallInt, sgId);
                //db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, whId);
                db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.SmallInt, workFlowId);
                //db.AddInParameter(dbCommand, "RefInvNo", SqlDbType.VarChar, refInvNo);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                        return Convert.ToDecimal(ds.Tables[0].Rows[0]["GSTRate"]);
                    else return 0;
                }
            }
        }

        internal static bool Submit(Submission sub, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitAccInvoice");
                db.AddInParameter(dbCommandDetail, "FormId", SqlDbType.Int, sub.FormId);
                db.AddInParameter(dbCommandDetail, "SubmissionComments", SqlDbType.VarChar, sub.Comments);
                db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.Int, sub.StateId);
                db.AddInParameter(dbCommandDetail, "UpdatedBy", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommandDetail, "Owner", SqlDbType.VarChar, sub.Owner.ToLower());
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