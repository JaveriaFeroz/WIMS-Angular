using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public class Calendar
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public List<CalendarDays> Details { get; set; } = new List<CalendarDays>();
        #endregion

        #region constructor
        public Calendar()
        {
        }
        #endregion

        #region internal methods
        internal static Calendar Get(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                return new Calendar
                {
                    Details = CalendarDays.Get(dateFrom, dateTo)
                }; 
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(Calendar c, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    CalendarDays.Save(c.Details, userId, transaction);
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
    }
}