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
    public class InvCalendar: IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? CalendarId { get; set; }
        public string CalendarName { get; set; }
        public List<InvCal_Detail> Details { get; set; } = new List<InvCal_Detail>();
        public List<InvCal_Detail> Expired { get; set; } = new List<InvCal_Detail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public InvCalendar()
        {
        }
        #endregion

        #region internal methods
        internal static InvCalendar Get(short calendarId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceCalendarById"))
            {
                db.AddInParameter(dbCommand, "CalendarId", SqlDbType.SmallInt, calendarId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        using (InvCalendar ic = new InvCalendar())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            #region reading header fields
                            ic.CalendarId = calendarId;
                            ic.CalendarName = dr["CalendarName"].ToString();
                            ic.Footer = new agFooter(dr);
                            #endregion

                            #region Grid data
                            List<InvCal_Detail> lstICD = InvCal_Detail.Get(calendarId);
                            ic.Details = lstICD.Where(a=>!a.Expired).ToList();
                            ic.Expired = lstICD.Where(a=>a.Expired).ToList();
                            #endregion
                            return ic;
                        }

                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(InvCalendar ic, string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvoiceCalendar"))
            {
                db.AddInParameter(dbCommand, "CalendarId", SqlDbType.SmallInt, ic.CalendarId);
                db.AddInParameter(dbCommand, "CalendarName", SqlDbType.VarChar, ic.CalendarName);
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, ic.Footer.UpdatedOn);
                db.AddOutParameter(dbCommand, "NewCalendarId", SqlDbType.Int, 32);
                using (DbConnection dbconnection = db.CreateConnection())
                {
                    dbconnection.Open();
                    DbTransaction transaction = dbconnection.BeginTransaction();
                    try
                    {
                        db.ExecuteNonQuery(dbCommand, transaction);
                        ic.CalendarId = Convert.ToInt16(dbCommand.Parameters["@NewCalendarID"].Value);
                        InvCal_Detail.Save(ic.CalendarId.Value, ic.Details, userId, transaction);
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
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}