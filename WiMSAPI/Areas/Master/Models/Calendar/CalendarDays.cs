using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class CalendarDays : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public DateTime? CalendarDate { get; set; }
        public short DayTypeId { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructor
        public CalendarDays()
        {
        }
        #endregion

        #region internal methods
        internal static List<CalendarDays> Get(DateTime dateFrom, DateTime dateTo)
        {
            try
            {
                List<CalendarDays> calendardays = new List<CalendarDays>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetCalendarDays"))
                {
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                calendardays.Add(new CalendarDays
                                {
                                    CalendarDate = Convert.ToDateTime(dr["CalendarDate"]),
                                    DayTypeId = Convert.ToInt16(dr["DayTypeId"])
                                });
                            }
                        }
                    }
                }
                return calendardays;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(List<CalendarDays> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (CalendarDays cd in agHelper.GetEdits(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCalendarDays"))
                    {
                        db.AddInParameter(dbCommand, "CalendarDate", SqlDbType.DateTime, cd.CalendarDate);
                        db.AddInParameter(dbCommand, "DayTypeId", SqlDbType.TinyInt, cd.DayTypeId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        public void Dispose()
        {
        }
    }
}