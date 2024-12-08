using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Areas.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance
{
    public class Invoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? FormId { get; set; }
        public int? InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public short? StorerGroupId { get; set; }
        //public short? WHId { get; set; }
        public short? PCId { get; set; }
        public string PCName { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public short CalendarId { get; set; }
        public string CalendarName { get; set; }
        public double GSTRate { get; set; }
        public bool InclLastPeriod { get; set; }
        public List<InvoiceValidation> Validation { get; set; } = new List<InvoiceValidation>();
        public agFooter Footer { get; set; } = new agFooter();
        public string Owner { get; set; }
        public bool Approved { get; set; } = false;
        public bool Rejected { get; set; } = false;
        public bool Completed { get; set; } = false;
        public short? StateId { get; set; }
        public string StateName { get; set; }
        #endregion

        #region constructor
        public Invoice()
        {
        }
        #endregion

        //comment from sadiq, this class require further checking and corrections during SQA
        #region internal methods
        internal static bool Generate(Invoice inv, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GenerateInvoice"))
            {
                db.AddInParameter(dbCommand, "GroupId", SqlDbType.Int, inv.StorerGroupId);
                //db.AddInParameter(dbCommand, "WHId", SqlDbType.Int, inv.WHId);
                db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, inv.PCId);
                db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, inv.DateFrom);
                db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, inv.DateTo);                          
                db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Decimal, inv.GSTRate);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.ExecuteNonQuery(dbCommand);
                return true;
            }
        }

        internal static Invoice GetCalendar(short storerGroupId, short pcId, bool invoiceOnLastPeriod, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceCalendar"))
                {
                    db.AddInParameter(dbCommand, "StorerGroupid", SqlDbType.SmallInt, storerGroupId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                    db.AddInParameter(dbCommand, "inclPastPeriod", SqlDbType.Bit, invoiceOnLastPeriod);                    
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new Invoice
                            {
                                StorerGroupId = storerGroupId,
                                PCId = pcId,
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo =Convert.ToDateTime(dr["DateTo"]),
                                CalendarId = Convert.ToInt16(dr["CalendarId"]),
                                CalendarName = dr["CalendarName"].ToString(),
                                GSTRate = Convert.ToInt16(dr["GSTRate"]),
                               // PCId = dr["PCId"].ToString(),
                                //PCName = dr["PCName"].ToString()
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool UnInvoice(string invoiceNo, bool ack, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("UnInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invoiceNo);
                    db.AddInParameter(dbCommand, "ackCompletion", SqlDbType.Bit, ack);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }

        internal static void SetCompleted(int invoiceId, DbTransaction transaction)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SetInvoiceCompleted"))
                {
                    dbCommand.Transaction = transaction;
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                    db.ExecuteNonQuery(dbCommand, transaction);
                }
            }
            catch (Exception) { throw; }
        }

        internal static Invoice Get(short formId, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceRequestById"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    using (Invoice inv = new Invoice())
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            inv.FormId = formId;
                            //inv.WHId = Convert.ToInt16(dr["WHId"]);
                            inv.StorerGroupId = Convert.ToInt16(dr["StorerGroupId"]);
                            inv.PCId = Convert.ToInt16(dr["PCId"]);
                            //inv.PCName = dr["PCName"].ToString();
                            inv.CalendarId = Convert.ToInt16(dr["CalendarId"]);
                            inv.CalendarName = dr["CalendarName"].ToString();
                            inv.DateFrom = Convert.ToDateTime(dr["DateFrom"]);
                            inv.DateTo = Convert.ToDateTime(dr["DateTo"]);                           
                            inv.StateId = Convert.ToInt16(dr["StateId"]);
                            inv.GSTRate = Convert.ToInt16(dr["GSTRate"]);
                            inv.InclLastPeriod = Convert.ToBoolean(dr["IncludeLastPeriod"]);
                            inv.Owner = dr["Owner"].ToString();
                            inv.Completed = Convert.ToBoolean(dr["Completed"]);
                            inv.Footer = new agFooter(dr);
                            return inv;
                        }
                        else
                            return null;
                    }
                }
            }
        }

        internal static bool Save(Invoice inv, string _userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvoiceRequest"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, inv.FormId);
                    db.AddInParameter(dbCommand, "SGId", SqlDbType.Int, inv.StorerGroupId);
                    //db.AddInParameter(dbCommand, "WHId", SqlDbType.Int, inv.WHId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, inv.PCId);
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, inv.DateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, inv.DateTo);
                    db.AddInParameter(dbCommand, "CalendarId", SqlDbType.SmallInt, inv.CalendarId);
                    db.AddInParameter(dbCommand, "IncludeLastPeriod", SqlDbType.Bit, inv.InclLastPeriod);
                    db.AddInParameter(dbCommand, "GSTRate", SqlDbType.Decimal, inv.GSTRate);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, inv.Footer.UpdatedOn);
                    db.AddOutParameter(dbCommand, "newFormId", SqlDbType.SmallInt, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    inv.FormId = Convert.ToInt32(dbCommand.Parameters["@newFormId"].Value);
                    transaction.Commit();
                    return true;
                }
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        internal static bool SubmitInvoice(Submission sub, string userId)
        {
            try
            {
                DbCommand dbCommandDetail = db.GetStoredProcCommand("SubmitInvoice");
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
            // no implementation
        }
        #endregion
    }
}