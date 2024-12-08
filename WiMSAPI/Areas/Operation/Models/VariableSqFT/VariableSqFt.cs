using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data.Common;

namespace WiMSAPI.Areas.Operation.Models
{
    public class VariableSqFt : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? StorerGroupId { get; set; }
        public short PCId { get; set; }
        public short? StorageTypeId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public List<SqFtReading> Details { get; set; } = new List<SqFtReading>();
        #endregion

        #region constructor
        public VariableSqFt()
        {

        }
        #endregion

        #region internal methods
        internal static VariableSqFt Get(short storerGroupId, short pcId, DateTime dateFrom, DateTime dateTo, 
            short storageTypeId, string userId)
        {
            try
            {
                VariableSqFt vsf = new VariableSqFt() { Details = SqFtReading.Get(storerGroupId, pcId, dateFrom, dateTo, storageTypeId, userId) };
                if (vsf.Details.Count > 0)
                {
                    vsf.StorerGroupId = storerGroupId;
                    vsf.PCId = pcId;
                    vsf.StorageTypeId = storageTypeId;
                    vsf.DateFrom = dateFrom;
                    vsf.DateTo = dateTo;
                    return vsf;
                }
                else
                    return null;
            }
            catch (Exception) { throw;}
        }

        internal static bool Save(VariableSqFt sqft, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    SqFtReading.Save(sqft.StorerGroupId.Value, sqft.PCId, sqft.StorageTypeId.Value, sqft.Details, userId, transaction);
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
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }   
}