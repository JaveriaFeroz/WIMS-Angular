using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public class WHTExemptions : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public int ExemptionId { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        #endregion

        #region constructor
        public WHTExemptions()
        {
        }
        #endregion

        #region internal methods
        internal static List<WHTExemptions> Get()
        {
            List<WHTExemptions> exemptions = new List<WHTExemptions>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("getWHTExemptionList"))
            {
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            exemptions.Add(new WHTExemptions
                            {
                                ExemptionId = Convert.ToInt32(dr["WHTExemptionId"]),
                                DateFrom = dr["DateFrom"].ToString(),
                                DateTo = dr["DateTo"].ToString()
                            });
                        }
                    }
                }
            }
            return exemptions;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}