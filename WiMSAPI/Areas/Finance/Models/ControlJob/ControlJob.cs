using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class ControlJob : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? PeriodId { get; set; }
        public string PeriodName { get; set; }
        public List<ControlJob_Detail> Details { get; set; } = new List<ControlJob_Detail>();
        #endregion

        #region constructor
        public ControlJob()
        {
        }
        #endregion

        #region internal methods
        internal static ControlJob Get(short periodId)
        {
            ControlJob cj = new ControlJob
            {
                PeriodId = periodId,
                Details = ControlJob_Detail.Get(periodId)
            };
            return cj;
        }

        internal static bool Save(ControlJob cj, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    ControlJob_Detail.Save(cj.PeriodId.Value, cj.Details, userId, transaction);
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