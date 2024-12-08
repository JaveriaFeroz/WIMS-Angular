using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class InvCalendars : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short CalendarId { get; set; }
        public string CalendarName { get; set; }
        #endregion

        #region constructor
        public InvCalendars()
        {
        }
        #endregion

        #region internal methods
        internal static List<InvCalendars> Get()
        {
            List<InvCalendars> calendars = new List<InvCalendars>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceCalendars"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            calendars.Add(new InvCalendars
                            {
                                CalendarId = Convert.ToInt16(dr["CalendarId"]),
                                CalendarName = dr["CalendarName"].ToString()
                            });
                        }
                    }
                }
            }
            return calendars;
        }
        #endregion

        #region Dispose
        public void Dispose()
        {
        }
        #endregion
    }
}