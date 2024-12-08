using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Finance
{
    [DataContract]
    public class Invoices : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int FormId { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string StorerGroupName { get; set; }
        //public string WHName { get; set; }
        public string PCName { get; set; }
        public string StateName { get; set; }
        #endregion

        #region constructor
        public Invoices()
        {

        }
        #endregion

        #region internal methods
        internal static List<Invoices> Get(string userId)
        {
            return get("GetInvoices", userId);
        }

        internal static List<Invoices> GetGroupInvoices(string userId)
        {
            return get("GetGroupInvoices", userId);
        }

        internal static List<Invoices> GetPendingInvoices(string userId)
        {
            return getForms("GetPendingInvoices", userId);
        }
        #endregion

        #region private methods
        private static List<Invoices> get(string spName, string userId)
        {
            try
            {
                List<Invoices> invoices = new List<Invoices>();
                using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                invoices.Add(new Invoices
                                {
                                    InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                                    InvoiceNo = dr["InvoiceNo"].ToString(),
                                    InvoiceDate = dr["InvoiceDate"].ToString(),
                                    StorerGroupName = dr["StorerGroupName"].ToString(),
                                    PCName = dr["PCName"].ToString()
                                    //WHName = dr["WHName"].ToString()
                                });
                            }
                        }
                    }
                }
                return invoices;
            }
            catch (Exception) { throw; }
        }

        private static List<Invoices> getForms(string spName, string userId)
        {
            try
            {
                List<Invoices> invoices = new List<Invoices>();
                using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                invoices.Add(new Invoices
                                {
                                    FormId = Convert.ToInt32(dr["FormId"]),
                                    StorerGroupName = dr["StorerGroupName"].ToString(),
                                    //WHName = dr["WHName"].ToString(),
                                    PCName = dr["PCName"].ToString(),
                                    StateName = dr["StateName"].ToString()
                                });
                            }
                        }
                    }
                }
                return invoices;
            }
            catch (Exception) { throw; }
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