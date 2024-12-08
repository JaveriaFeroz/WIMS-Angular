using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class InvoiceInfo
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string InvoiceDate { get; set; }
        public short StorerGroupId { get; set; }
        public string StorerGroupName { get; set; }
        public short PCId { get; set; }
        public string PCName { get; set; }
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public double GSTRate { get; set; }
        #endregion

        public InvoiceInfo() { }

        #region internal methods
        internal static InvoiceInfo Get(string invoiceNo, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceByNo"))
            {
                db.AddInParameter(dbCommand, "InvoiceNo", SqlDbType.VarChar, invoiceNo);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new InvoiceInfo
                        {
                            InvoiceDate = Convert.ToDateTime(dr["InvoiceDate"]).ToString("dd-MMM-yy"),
                            StorerGroupId = Convert.ToInt16(dr["StorerGroupId"]),
                            StorerGroupName = dr["StorerGroupName"].ToString(),
                            PCId = Convert.ToInt16(dr["PCId"]),
                            PCName = dr["PCName"].ToString(),
                            PeriodId = Convert.ToInt16(dr["PeriodId"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            GSTRate = Convert.ToDouble(dr["GSTRate"])
                        };
                    }
                    else
                        return null;
                }
            }
        }
        #endregion
    }
}
