using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Master.Models
{
    public class AccessorialCharges : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string ChargeId { get; set; }
        public string ChargeName { get; set; }
        public string ChargeCode { get; set; }
        #endregion

        #region constructor
        public AccessorialCharges()
        {

        }
        #endregion

        #region internal methods
        internal static List<AccessorialCharges> Get(bool activeOnly = true)
        {
            List<AccessorialCharges> acccharges = new List<AccessorialCharges>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessorialCharges"))
            {
                db.AddInParameter(dbCommand, "activeonly", SqlDbType.Bit, Convert.ToInt16(activeOnly));
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            acccharges.Add(new AccessorialCharges
                            {
                                ChargeId = dr["ChargeId"].ToString(),
                                ChargeName = dr["ChargeName"].ToString(),
                                ChargeCode = dr["ControlChargeCode"].ToString()
                            });
                        }
                    }
                }
            }
            return acccharges;
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