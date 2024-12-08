using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class InvCal_Detail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? ICDId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; } 
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public bool Expired { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public InvCal_Detail()
        {

        }
        #endregion

        #region internal methods
        internal static List<InvCal_Detail> Get(short calendarId)
        {
            List<InvCal_Detail> details = new List<InvCal_Detail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetInvoiceCalendarDetailById"))
            {
                db.AddInParameter(dbCommand, "CalendarId", SqlDbType.TinyInt, calendarId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new InvCal_Detail
                            {
                                ICDId = Convert.ToInt32(dr["ICDId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"]),
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString(),
                                Expired = Convert.ToBoolean(dr["Expired"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(short calendarId, List<InvCal_Detail> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (InvCal_Detail icd in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveInvCalendarDetail"))
                    {
                        db.AddInParameter(dbCommand, "CalendarId", SqlDbType.SmallInt, calendarId);
                        db.AddInParameter(dbCommand, "ICDId", SqlDbType.Int, icd.ICDId);
                        db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, icd.DateFrom);
                        db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, icd.DateTo);
                        db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, icd.PeriodId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (icd.Delete ? "D" : (icd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}