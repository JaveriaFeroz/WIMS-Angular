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
    public class Periods : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        #endregion

        #region constructor
        public Periods()
        {
        }
        #endregion

        #region internal methods
        internal static List<Periods> Get(int? year = null)
        {
            List<Periods> periods = new List<Periods>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetPeriods"))
            {
                db.AddInParameter(dbCommand, "Year", SqlDbType.SmallInt, year);
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            periods.Add(new Periods
                            {
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString()
                            });
                        }
                    }
                }
            }
            return periods;
        }

        internal static List<Periods> GetPeriods()
        {
            List<Periods> periods = new List<Periods>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAllPeriods"))
            {
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            periods.Add(new Periods
                            {
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                PeriodName = dr["PeriodName"].ToString()
                            });
                        }
                    }
                }
            }
            return periods;
        }

        //internal static Periods GetCurrentPeriod()
        //{
        //    using (DbCommand dbCommand = db.GetStoredProcCommand("GetCurrentPeriod"))
        //    {
        //        using (DataSet ds = db.ExecuteDataSet(dbCommand))
        //        {
        //            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //            {
        //                return new Periods
        //                {
        //                    PeriodId = Convert.ToInt16(ds.Tables[0].Rows[0]["PeriodId"]),
        //                    PeriodName = ds.Tables[0].Rows[0]["PeriodName"].ToString()
        //                };
        //            }
        //            else
        //                return null;
        //        }
        //    }
        //}
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}