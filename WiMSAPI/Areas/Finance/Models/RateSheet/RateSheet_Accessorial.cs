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
    public class RateSheet_Accessorial : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSAId { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; } 
        public string ChargeName { get; set; }
        public decimal Rate { get; set; }
        public decimal Qty { get; set; }
        #endregion

        #region constructor
        public RateSheet_Accessorial()
        {

        }
        #endregion

        #region internal method
        internal static List<RateSheet_Accessorial> GetFixed(int rateSheetId)
        {
            return get("GetRateSheet_FixedAccessorial", rateSheetId);
        }

        internal static List<RateSheet_Accessorial> GetVariable(int rateSheetId)
        {
            return get("GetRateSheet_VariableAccessorial", rateSheetId);
        }
        #endregion

        #region private methods
        private static List<RateSheet_Accessorial> get(string spName, int rateSheetId)
        {
            List<RateSheet_Accessorial> accessorials = new List<RateSheet_Accessorial>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            accessorials.Add(new RateSheet_Accessorial
                            {
                                RSAId= Convert.ToInt16(dr["RSAId"]),
                                DateFrom = dr["DateFrom"].ToString(),
                                DateTo = dr["DateTo"].ToString(),
                                ChargeName = dr["ChargeName"].ToString(),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                Qty = Convert.ToDecimal(dr["Qty"]),
                            });
                        }
                    }
                }
            }
            return accessorials;
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}
