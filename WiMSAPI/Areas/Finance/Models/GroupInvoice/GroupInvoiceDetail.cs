using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class GroupInvoiceDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public bool Selected { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string PeriodName { get; set; }
        public string WorkFlowName { get; set; }
        public decimal InvoiceAmount { get; set; }
        #endregion

        #region constructor
        public GroupInvoiceDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<GroupInvoiceDetail> Get(int giId)
        {
            try
            {
                List<GroupInvoiceDetail> details = new List<GroupInvoiceDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetGroupInvoiceDetail"))
                {
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, giId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new GroupInvoiceDetail
                                {
                                    Selected = Convert.ToBoolean(dr["Selected"]),
                                    InvoiceNo = dr["InvoiceNo"].ToString(),
                                    InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                    InvoiceDate = dr["InvoiceDate"].ToString(),
                                    PeriodName = dr["PeriodName"].ToString(),
                                    WorkFlowName = dr["WorkFlowName"].ToString(),
                                    InvoiceAmount = Convert.ToDecimal(dr["InvoiceAmount"])
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static List<GroupInvoiceDetail> GetForGrouping(short sgId, short pcId)
        {
            try
            {
                List<GroupInvoiceDetail> details = new List<GroupInvoiceDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoicesForGrouping"))
                {
                    db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, sgId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new GroupInvoiceDetail
                                {
                                    Selected = true,
                                    InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                    InvoiceNo = dr["InvoiceNo"].ToString(),
                                    InvoiceDate = dr["InvoiceDate"].ToString(),
                                    WorkFlowName = dr["WorkFlowName"].ToString(),
                                    PeriodName = dr["PeriodName"].ToString(),
                                    InvoiceAmount = Convert.ToDecimal(dr["InvoiceAmount"])
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int giId, List<GroupInvoiceDetail> details, DbTransaction transaction)
        {
            try
            {
                foreach (GroupInvoiceDetail gid in details.Where(x=>x.Selected))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveGroupInvoiceDetail"))
                    {
                        db.AddInParameter(dbCommand, "GroupInvoiceId", SqlDbType.Int, giId);
                        db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, gid.InvoiceId);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}
