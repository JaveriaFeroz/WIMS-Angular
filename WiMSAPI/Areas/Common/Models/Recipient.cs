using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Common.Models
{
    public class Recipient
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string RecipientId { get; set; }
        public string RecipientName { get; set; }
        //public List<Recipient> Recipients { get; set; }
        #endregion

        #region constructor
        public Recipient()
        {
        }
        #endregion

        #region internal methods
        internal static List<Recipient> GetCPRecipients(int provisionId, short stateId, out short nextStateId)
        {
            return get("GetCostProvisionRecipients", new string[,] { { "ProvisionId", provisionId.ToString() } }, stateId, out nextStateId);
        }

        internal static List<Recipient> GetOwner(int formId, agEnums.WorkFlow workflowId)
        {
            return getOwner("GetForm_Creator", (short)workflowId, "FormId", formId);
        }
        //internal static List<Recipient> GetCPOwner(int provisionId)
        //{
        //    return getOwner("getProvisionOwner", "ProvisionId", provisionId);
        //}

        //internal static List<Recipient> GetDNRecipients(int dnId, short stateId, out short nextStateId)
        //{
        //    return get("GetDNRecipients", "InvoiceId", dnId.ToString(), stateId, out nextStateId);
        //}

        //internal static List<Recipient> GetDNOwner(int dnId)
        //{
        //    return getOwner("GetDNOwner", "InvoiceId", dnId);
        //}
        internal static List<Recipient> GetWFRateSeheetRecipients(int formId, short stateId, out short nextStateId)
        {
            return get("GetWF_RateSheet_Recipients", new string[,] { { "FormId", formId.ToString() } }, stateId, out nextStateId);
        }

        //internal static List<Recipient> GetWFRateSheetOwner(int formid)
        //{
        //    return getOwner("GetWFRateSheetOwner", "FormId", formid);
        //}

        internal static List<Recipient> GetAccInvoiceRecipients(int formId, short workFlowId, short stateId, out short nextStateId)
        {
            return get("GetAccInvoiceRecipients", new string[,] { 
                { "FormId", formId.ToString() }, { "WorkFlowId", workFlowId.ToString() } 
            }, stateId, out nextStateId);
        }

        //internal static List<Recipient> GetAdHocInvoiceOwner(int formid)
        //{
        //    return getOwner("GetAdHocInvoiceOwner", "FormId", formid);
        //}

        internal static List<Recipient> GetInvoiceRecipients(int formId, short stateId, out short nextStateId)
        {
            return get("GetInvoiceRecipients", new string[,] { { "FormId", formId.ToString() } }, stateId, out nextStateId);
        }

        //internal static List<Recipient> GetInvoiceOwner(int formid)
        //{
        //    return getOwner("GetInvoiceOwner", "FormId", formid);
        //}
        #endregion

        #region private methods
        private static List<Recipient> get(string spName, string[,] keys, short currentStateId, 
            out short nextStateId)
        {
            List<Recipient> recipients = new List<Recipient>();
            try
            {
                nextStateId = currentStateId;
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand(spName))
                {
                    for(short i = 0; i < keys.GetLength(0); i++)
                    {
                        db.AddInParameter(dbCommandDetail, keys[i, 0], SqlDbType.VarChar, keys[i,1]);
                    }
                    //db.AddInParameter(dbCommandDetail, keyName, SqlDbType.VarChar, keyValue);
                    db.AddInParameter(dbCommandDetail, "StateId", SqlDbType.SmallInt, currentStateId);
                    db.AddOutParameter(dbCommandDetail, "NextStateId", SqlDbType.SmallInt, 32);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds != null && ds.Tables[0].Rows.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                recipients.Add(new Recipient
                                {
                                    RecipientId = dr["UserId"].ToString(),
                                    RecipientName = dr["UserName"].ToString()
                                });
                            }
                            nextStateId = Convert.ToInt16(dbCommandDetail.Parameters["@NextStateId"].Value);
                        }
                    }
                }
                return recipients;
            }
            catch (Exception) { throw; }
        }

        private static List<Recipient> getOwner(string _spName, short _workflowid, string _keyName, int _keyValue)
        {
            List<Recipient> recipients = new List<Recipient>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand(_spName))
                {
                    db.AddInParameter(dbCommandDetail, _keyName, SqlDbType.Int, _keyValue);
                    db.AddInParameter(dbCommandDetail, "workflowId", SqlDbType.SmallInt, _workflowid);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            recipients.Add(new Recipient
                            {
                                RecipientId = ds.Tables[0].Rows[0]["UserId"].ToString(),
                                RecipientName = ds.Tables[0].Rows[0]["UserName"].ToString()
                            });
                            return recipients;
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}