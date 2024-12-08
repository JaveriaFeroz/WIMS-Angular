using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class AccInvoices : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //[Browsable(false)]
        //public int InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string StorerGroupName { get; set; }
        //public string WHName { get; set; }
        public string PCName { get; set; }
        public string Owner { get; set; }
        #endregion

        #region constructor
        public AccInvoices()
        {
        }
        #endregion

        #region internal methods
        internal static List<AccInvoices> Get(agEnums.WorkFlow workflowId, string userId)
        {
            List<AccInvoices> invoices = new List<AccInvoices>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccInvoices"))
            {
                db.AddInParameter(dbCommand, "WorkFlowId", SqlDbType.TinyInt, workflowId);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            invoices.Add(new AccInvoices
                            {
                                //InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                InvoiceNo = dr["InvoiceNo"].ToString(),
                                InvoiceDate = dr["InvoiceDate"].ToString(),
                                StorerGroupName = dr["StorerGroupName"].ToString(),
                                //WHName = dr["WHName"].ToString(),
                                PCName = dr["PCName"].ToString(),
                                Owner = dr["Owner"].ToString()
                            });
                        }
                    }
                }
            }
            return invoices;
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