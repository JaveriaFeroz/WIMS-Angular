using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Upload.Models
{
    [DataContract]
    public class stDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string SKU { get; set; }
        public decimal Quantity { get; set; }
        public string UoM { get; set; }        
        public string Lottable01 { get; set; }
        public string Lottable02 { get; set; }
        public string Lottable03 { get; set; }
        public string Lottable04 { get; set; }
        public string Lottable05 { get; set; }
        public string Lottable06 { get; set; }
        public string Lottable07 { get; set; }
        public string Lottable08 { get; set; }
        public string Lottable09 { get; set; }
        public string Lottable10 { get; set; }
        #endregion

        #region constructor
        public stDetail()
        {
            
        }
        #endregion

        #region internal methods
        //internal static bool Save(int requestId, List<SODetail> details, DbTransaction transaction)
        //{
        //    try
        //    {
        //        foreach (SODetail sod in details)
        //        {
        //            using (DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadOrderDetail"))
        //            {
        //                db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
        //                db.AddInParameter(dbCommand, "SKU", SqlDbType.VarChar, sod.SKU);
        //                db.AddInParameter(dbCommand, "Quantity", SqlDbType.Decimal, sod.Quantity);
        //                db.AddInParameter(dbCommand, "UoM", SqlDbType.VarChar, sod.UoM);
        //                db.AddInParameter(dbCommand, "Lottable01", SqlDbType.VarChar, sod.Lottable01);
        //                db.AddInParameter(dbCommand, "Lottable02", SqlDbType.VarChar, sod.Lottable02);
        //                db.AddInParameter(dbCommand, "Lottable03", SqlDbType.VarChar, sod.Lottable03);
        //                if (!string.IsNullOrWhiteSpace(sod.Lottable04.ToString()))
        //                {
        //                    db.AddInParameter(dbCommand, "Lottable04", SqlDbType.DateTime, Convert.ToDateTime(sod.Lottable04));
        //                }
        //                if (!string.IsNullOrWhiteSpace(sod.Lottable05.ToString()))
        //                {
        //                    db.AddInParameter(dbCommand, "Lottable05", SqlDbType.DateTime, Convert.ToDateTime(sod.Lottable05));
        //                }
        //                db.AddInParameter(dbCommand, "Lottable06", SqlDbType.VarChar, sod.Lottable06);
        //                db.AddInParameter(dbCommand, "Lottable07", SqlDbType.VarChar, sod.Lottable07);
        //                db.AddInParameter(dbCommand, "Lottable08", SqlDbType.VarChar, sod.Lottable08);
        //                db.AddInParameter(dbCommand, "Lottable09", SqlDbType.VarChar, sod.Lottable09);
        //                db.AddInParameter(dbCommand, "Lottable10", SqlDbType.VarChar, sod.Lottable10);
        //                db.ExecuteNonQuery(dbCommand, transaction);
        //            }
        //        }
        //        return true;
        //    }
        //    catch (Exception)
        //    { throw; }
        //}
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}