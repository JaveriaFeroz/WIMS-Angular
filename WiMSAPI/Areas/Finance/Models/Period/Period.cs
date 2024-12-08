using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class Period : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short PeriodId { get; set; }
        public string PeriodName { get; set; }
        public string CurrentMonth { get; set; }
        public int CurrentYear { get; set; }        
        #endregion

        #region constructor
        public Period()
        {
        }
        #endregion

        #region internal methods
        internal static Period Get()
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCurrentPeriod"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new Period
                        {
                            CurrentMonth = dr["pMonth"].ToString(),
                            CurrentYear = Convert.ToInt32(dr["pYear"]),
                            PeriodName = dr["PeriodName"].ToString(),
                            PeriodId = Convert.ToInt16(dr["PeriodId"])
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static Period Close(string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("closeCurrentPeriod"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.ExecuteNonQuery(dbCommand);
                    return Get();
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