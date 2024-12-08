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
    public class InvoiceValidation : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string StorerKey { get; set; }
        public string WHName { get; set; }
        public string SKU { get; set; }
        public string EventType { get; set; }
        public string ErrorText { get; set; }
        #endregion

        #region constructor
        public InvoiceValidation()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvoiceValidation> Validate(short storerGroupId, short pcId, 
            DateTime dateFrom, DateTime dateTo, string userId)
        {
            try
            {
                List<InvoiceValidation> validations = new List<InvoiceValidation>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("PreInvoiceValidation"))
                {
                    db.AddInParameter(dbCommand, "GroupId", SqlDbType.SmallInt, storerGroupId);
                 //   db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, whId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                    db.AddInParameter(dbCommand, "InvoiceFrom", SqlDbType.DateTime, dateFrom);
                    db.AddInParameter(dbCommand, "InvoiceTo", SqlDbType.DateTime, dateTo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                validations.Add(new InvoiceValidation
                                {
                                    StorerKey = dr["StorerKey"].ToString(),
                                    WHName = dr["WMSSchemaName"].ToString(),
                                    SKU = dr["SKU"].ToString(),
                                    ErrorText = dr["ErrorText"].ToString(),
                                    EventType = dr["EventTypeName"].ToString()
                                });
                            }
                        }
                    }
                }
                return validations;
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