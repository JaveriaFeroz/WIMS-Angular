using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class DRCRDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int DetailId { get; set; }
        public short ChargeTypeId { get; set; }
        public short UoMId { get; set; }
        public decimal Quantity { get; set; } = 0;
        public decimal Rate { get; set; } = 0;
        public decimal Amount { get { return Quantity * Rate; } set {; } }
        public string Remarks { get; set; }
        public short StateId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public DRCRDetail()
        {

        }
        #endregion

        #region internal methods
        internal static List<DRCRDetail> Get(int invoiceId)
        {
            List<DRCRDetail> details = new List<DRCRDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetDRCRDetailById"))
            {
                db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new DRCRDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                ChargeTypeId = Convert.ToInt16(dr["ChargeTypeId"]),
                                UoMId = Convert.ToInt16(dr["UoMId"]),
                                Quantity = Convert.ToDecimal(dr["Quantity"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                Remarks = dr["Remarks"].ToString(),
                                StateId = Convert.ToInt16(dr["StateId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(int invoiceId, AccInvoice ai, DbTransaction transaction)
        {
            try
            {
                foreach (DRCRDetail dcd in agHelper.GetChanges(ai.PreviousDetails.Union(ai.RevisedDetails).ToList()))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveDRCRDetail"))
                    {
                        db.AddInParameter(dbCommand, "InvoiceId", SqlDbType.Int, invoiceId);
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, dcd.DetailId);
                        db.AddInParameter(dbCommand, "ChargeTypeId", SqlDbType.SmallInt, dcd.ChargeTypeId);
                        db.AddInParameter(dbCommand, "Quantity", SqlDbType.Decimal, dcd.Quantity);
                        db.AddInParameter(dbCommand, "UoMId", SqlDbType.TinyInt, dcd.UoMId);
                        db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, dcd.Rate);
                        db.AddInParameter(dbCommand, "Remarks", SqlDbType.VarChar, dcd.Remarks);
                        db.AddInParameter(dbCommand, "StateId", SqlDbType.SmallInt, dcd.StateId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (dcd.Delete ? "D" : (dcd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}