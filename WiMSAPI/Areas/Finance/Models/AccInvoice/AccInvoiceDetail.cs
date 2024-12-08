using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class AccInvoiceDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? IADId { get; set; }
        public short? ChargeId { get; set; }
        public short? UoMId { get; set; }
        public decimal Quantity { get; set; } = 0;
        public decimal Rate { get; set; } = 0;
        public decimal Amount { get { return Quantity * Rate; } set {; } }
        public bool Print { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public AccInvoiceDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<AccInvoiceDetail> Get(int invoiceId)
        {
            try
            {
                List<AccInvoiceDetail> details = new List<AccInvoiceDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccInvoiceDetailById"))
                {
                    db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds.Tables != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new AccInvoiceDetail
                                {
                                    IADId = Convert.ToInt32(dr["IADId"]),
                                    ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                    UoMId = Convert.ToInt16(dr["UoMId"]),
                                    Quantity = Convert.ToDecimal(dr["Quantity"]),
                                    Rate = Convert.ToDecimal(dr["Rate"]),
                                    Print = Convert.ToBoolean(dr["InvPrint"]),
                                    Add = false
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static List<AccInvoiceDetail> GetVariable(short sgId, short pcId, DateTime tranDate)
        {
            try
            {
                List<AccInvoiceDetail> details = new List<AccInvoiceDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetVariableAccDetail"))
                {
                    db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, sgId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                    db.AddInParameter(dbCommand, "TranDate", SqlDbType.DateTime, tranDate);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables != null)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new AccInvoiceDetail
                                {
                                    //IADId = Convert.ToInt32(dr["IADId"]),
                                    ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                    Rate = Convert.ToDecimal(dr["Rate"]),
                                    Quantity = 0,
                                    Print = true,
                                    Add = true
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static List<AccInvoiceDetail> GetFixed(short sgId, short pcId, DateTime tranDate)
        {
            try
            {
                List<AccInvoiceDetail> details = new List<AccInvoiceDetail>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetFixedAccDetail"))
                {
                    db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, sgId);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                    db.AddInParameter(dbCommand, "TranDate", SqlDbType.DateTime, tranDate);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables != null)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                details.Add(new AccInvoiceDetail
                                {
                                  //  IADId = Convert.ToInt32(dr["IADId"]),
                                    ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                    Quantity = Convert.ToDecimal(dr["Qty"]),
                                    Rate = Convert.ToDecimal(dr["Rate"]),
                                    Print = true,
                                    Add = true
                                });
                            }
                        }
                    }
                }
                return details;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(int invoiceId, List<AccInvoiceDetail> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (AccInvoiceDetail aid in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveAccInvoiceDetail"))
                    {
                        db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                        db.AddInParameter(dbCommand, "IADId", SqlDbType.Int, aid.IADId);
                        db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, aid.ChargeId);
                        db.AddInParameter(dbCommand, "Quantity", SqlDbType.Decimal, aid.Quantity);
                        db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, aid.Rate);
                        db.AddInParameter(dbCommand, "UoMId", SqlDbType.VarChar, aid.UoMId);
                        db.AddInParameter(dbCommand, "IsVisible", SqlDbType.Bit, aid.Print);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (aid.Delete ? "D" : (aid.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception){ throw; }
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