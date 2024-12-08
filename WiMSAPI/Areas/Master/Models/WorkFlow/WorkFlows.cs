using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class WorkFlows : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short WorkFlowId { get; set; }
        public string WorkFlowName { get; set; }
        #endregion

        #region constructor
        public WorkFlows()
        {

        }
        #endregion

        #region internal methods
        internal static List<WorkFlows> GetForInvoice()
        {
            List<WorkFlows> workflows = new List<WorkFlows>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceWorkFlows"))
            {
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            workflows.Add(new WorkFlows
                            {
                                WorkFlowId = Convert.ToInt16(dr["WorkFlowId"]),
                                WorkFlowName = dr["WorkFlowName"].ToString()
                            });
                        }
                    }
                }
            }
            return workflows;
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