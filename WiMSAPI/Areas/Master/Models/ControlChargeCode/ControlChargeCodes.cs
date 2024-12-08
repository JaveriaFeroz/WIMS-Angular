using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class ControlChargeCodes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string ChargeCode { get; set; }
        public string ChargeName { get; set; }
        #endregion

        #region constructor
        public ControlChargeCodes()
        {
        }
        #endregion

        #region internal methods
        internal static List<ControlChargeCodes> Get()
        {
            List<ControlChargeCodes> chargecodes = new List<ControlChargeCodes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetControlChargeCodes"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            chargecodes.Add(new ControlChargeCodes
                            {
                                ChargeCode = dr["ChargeCode"].ToString(),
                                ChargeName = dr["ChargeName"].ToString()
                            });
                        }
                    }
                }
            }
            return chargecodes;
        }
        #endregion

        public void Dispose()
        {
        }
    }
}