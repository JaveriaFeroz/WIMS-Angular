using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class GroupInvoice : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? GroupInvoiceId { get; set; }
        public string GroupInvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public short? StorerGroupId { get; set; }
        public short? PCId { get; set; }
        public List<GroupInvoiceDetail> Details { get; set; } = new List<GroupInvoiceDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public GroupInvoice()
        {
        }
        #endregion

        #region internal methods     
        internal static GroupInvoice Get(string groupInvNo, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetGroupInvoiceByNo"))
                {
                    db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, groupInvNo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new GroupInvoice
                            {
                                GroupInvoiceNo = groupInvNo,
                                GroupInvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceDate = Convert.ToDateTime(dr["InvoiceDate"]),
                                StorerGroupId = Convert.ToInt16(dr["StorerGroupId"]),
                                PCId = Convert.ToInt16(dr["PCId"]),
                                Footer = new agFooter(dr["CreatedBy"].ToString(), dr["CreatedOn"]),
                                Details = GroupInvoiceDetail.Get(Convert.ToInt32(dr["InvoiceId"]))
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(GroupInvoice gi, string userId)
        {
            DbConnection dbConnection = db.CreateConnection();
            dbConnection.Open();
            DbTransaction transaction = dbConnection.BeginTransaction();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGroupInvoice"))
                {
                    db.AddInParameter(dbCommand, "InvoiceDate", SqlDbType.DateTime, gi.InvoiceDate);
                    db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, gi.StorerGroupId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, gi.PCId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddOutParameter(dbCommand, "newGroupInvoiceId", SqlDbType.Int, 32);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    gi.GroupInvoiceId = Convert.ToInt32(dbCommand.Parameters["@newGroupInvoiceId"].Value);
                    GroupInvoiceDetail.Save(gi.GroupInvoiceId.Value, gi.Details, transaction);
                    Invoice.SetCompleted(gi.GroupInvoiceId.Value, transaction);
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
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }   
}