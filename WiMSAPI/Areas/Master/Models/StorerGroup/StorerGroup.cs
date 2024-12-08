using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class StorerGroup : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? GroupId { get; set; }
        public string GroupName { get; set; }
        public string Address { get; set; }
        public string ContactPerson { get; set; }
        public string ContactNo { get; set; }
        public string FaxNo { get; set; }
        public string Email { get; set; }
        public short? CreditDays { get; set; }
        public string NameOnInvoice { get; set; }
        public string NTN { get; set; }
        public string STRN { get; set; }
        public string CWClientId { get; set; }
        public bool PrintWithLetterHead { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        public List<StorerGroupDetail> Details { get; set; } = new List<StorerGroupDetail>();
        #endregion

        #region constructor
        public StorerGroup()
        {
        }
        #endregion

        #region internal methods
        internal static StorerGroup Get(short groupId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetStorerGroupById"))
            {
                db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, groupId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new StorerGroup
                            {
                                GroupId = Convert.ToInt16(dr["StorerGroupId"]),
                                GroupName = dr["StorerGroupName"].ToString(),
                                NameOnInvoice = dr["NameOnInvoice"].ToString(),
                                Address = dr["Address"].ToString(),
                                ContactPerson = dr["ContactName"].ToString(),
                                ContactNo = dr["ContactNo"].ToString(),
                                FaxNo = dr["FaxNo"].ToString(),
                                Email = dr["Email"].ToString(),
                                CreditDays = Convert.ToInt16(dr["CreditDays"]),
                                NTN = dr["NTN"].ToString(),
                                STRN = dr["STRN"].ToString(),
                                CWClientId = dr["CWClientId"].ToString(),
                                PrintWithLetterHead = Convert.ToBoolean(dr["PrintWithLetterHead"]),
                                Footer = new agFooter(dr),
                                Details = StorerGroupDetail.Get(groupId),
                            };
                        }
                        else
                            return null;
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(StorerGroup sg, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("SaveStorerGroup"))
            {
                db.AddInParameter(dbCommand, "StorerGroupID", SqlDbType.SmallInt, sg.GroupId);
                db.AddInParameter(dbCommand, "StorerGroupName", SqlDbType.VarChar, sg.GroupName);
                db.AddInParameter(dbCommand, "NameOnInvoice", SqlDbType.VarChar, sg.NameOnInvoice);
                db.AddInParameter(dbCommand, "Address", SqlDbType.VarChar, sg.Address);
                db.AddInParameter(dbCommand, "ContactPerson", SqlDbType.VarChar, sg.ContactPerson);
                db.AddInParameter(dbCommand, "ContactNo", SqlDbType.VarChar, sg.ContactNo);
                db.AddInParameter(dbCommand, "FaxNo", SqlDbType.VarChar, sg.FaxNo);
                db.AddInParameter(dbCommand, "Email", SqlDbType.VarChar, sg.Email);
                db.AddInParameter(dbCommand, "CreditDays", SqlDbType.SmallInt, sg.CreditDays);
                db.AddInParameter(dbCommand, "NTN", SqlDbType.VarChar, sg.NTN);
                db.AddInParameter(dbCommand, "STRN", SqlDbType.VarChar, sg.STRN);
                db.AddInParameter(dbCommand, "CWClientId", SqlDbType.VarChar, sg.CWClientId);
                db.AddInParameter(dbCommand, "PrintWithLetterHead", SqlDbType.Bit, sg.PrintWithLetterHead);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, sg.Footer.UpdatedOn);
                db.AddOutParameter(dbCommand, "NewStorerGroupID", SqlDbType.Int, 32);
                using (DbConnection dbconnection = db.CreateConnection())
                {
                    dbconnection.Open();
                    DbTransaction transaction = dbconnection.BeginTransaction();
                    try
                    {
                        db.ExecuteNonQuery(dbCommand, transaction);
                        sg.GroupId = Convert.ToInt16(dbCommand.Parameters["@NewStorerGroupID"].Value);
                        StorerGroupDetail.Save(sg.GroupId.Value, sg.Details, userId, transaction);
                        transaction.Commit();
                        return true;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
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