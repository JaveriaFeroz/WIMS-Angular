using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class InvoiceRemarks : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int InvoiceId { get; set; }
        public string InvoiceNo { get; set; }
        public string ProjectName { get; set; }
        public string ProjectTitle { get; set; }
        public string Remarks { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public InvoiceRemarks()
        {
        }
        #endregion

        #region internal methods
        internal static InvoiceRemarks Get(string invoiceNo, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRemarksByInvoiceNo"))
            {
                db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invoiceNo);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InvoiceRemarks
                        {
                            InvoiceNo = invoiceNo,
                            InvoiceId = Convert.ToInt32(dr["InvoiceId"]),
                            ProjectName = dr["ProjectName"].ToString(),
                            ProjectTitle = dr["ProjectTitle"].ToString(),
                            Remarks = dr["Remarks"].ToString(),
                            Footer = new agFooter(dr),
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InvoiceRemarks ir, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvoiceRemarks"))
                {
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, ir.InvoiceId);
                    db.AddInParameter(dbCommand, "ProjectName", SqlDbType.VarChar, ir.ProjectName);
                    db.AddInParameter(dbCommand, "ProjectTitle", SqlDbType.VarChar, ir.ProjectTitle);
                    db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, ir.Remarks);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ir.Footer.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
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