using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Common.Models
{
    public class UploadForm
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public List<UForms> UForms { get; set; } = new List<UForms>();
        #endregion

        #region constructor
        public UploadForm()
        {
        }
        #endregion

        #region internal methods
        internal static List<UForms> Get(short workFlowId, string userId)
        {
            List<UForms> forms = new List<UForms>();
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetForms_Upload"))
                {
                    db.AddInParameter(dbCommand, "workflowId", SqlDbType.SmallInt, workFlowId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            using (DataTable dt = ds.Tables[0])
                            {
                                foreach (DataRow dr in dt.Rows)
                                {
                                    forms.Add(new UForms
                                    {
                                        FormId = Convert.ToInt32(dr["RequestId"]),
                                        StateName = dr["StateName"].ToString(),
                                        Sender = dr["UploadedBy"].ToString(),
                                        SentOn = dr["SentOn"].ToString(),
                                        UploadedinWMSDbOn = dr["UploadedinWMSDbOn"].ToString(),
                                        WorkFlowId = Convert.ToInt16(dr["WorkFlowId"]),
                                        WorkFlowName = dr["WorkFlowName"].ToString(),
                                        WHName = dr["WHName"].ToString(),
                                        CustomerOrderNo = dr["CustomerOrderNo"].ToString(),
                                        StorerKey = dr["StorerKey"].ToString()
                                    });
                                }
                            }
                        }
                    }
                }
                return forms;
            }
            catch (Exception) { throw; }
        }
        #endregion
    }
}