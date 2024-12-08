using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Upload.Models
{
    public class st : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? RequestId { get; set; }
        public string StorerKey { get; set; }
        public short? WHId { get; set; }
        public DateTime Transactiondate { get; set; }
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
        public string Lottable11 { get; set; }
        public string Lottable12 { get; set; }
        public string Lottable13 { get; set; }
        public string Lottable14 { get; set; }
        public string Lottable15 { get; set; }
        public string Lottable16 { get; set; }
        public string Lottable17 { get; set; }
        public string Lottable18 { get; set; }
        //public List<SODetail> Details { get; set; } = new List<SODetail>();   
        #endregion

        #region constructor
        public st()
        {
        }
        #endregion

        #region internal methods
        internal static bool Save(List<st> sos, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ListConvertDataTable converter = new ListConvertDataTable();
                    DataTable dt = converter.ToDataTable(sos);
                    DbCommand dbCommand = db.GetStoredProcCommand("SaveUploadStorageBalance");
                    db.AddInParameter(dbCommand, "lstst", SqlDbType.Structured, dt);
                    db.AddInParameter(dbCommand, "TransactionDateTime", SqlDbType.DateTime, sos[0].Transactiondate);
                    db.AddInParameter(dbCommand, "WarehouseId", SqlDbType.SmallInt, sos[0].WHId);
                    int res = db.ExecuteNonQuery(dbCommand);
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
        #endregion

        #region private methods
        private static bool markComplete(int requestId, DbTransaction transaction)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("CompleteSO"))
                {
                    db.AddInParameter(dbCommand, "RequestId", SqlDbType.Int, requestId);
                    db.ExecuteNonQuery(dbCommand, transaction);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
        }
        #endregion
    }
}