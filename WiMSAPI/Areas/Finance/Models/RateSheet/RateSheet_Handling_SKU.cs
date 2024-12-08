using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class RateSheet_Handling_SKU : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSHId { get; set; }
        public string SKUCode { get; set; }
        public decimal MinUnit { get; set; }
        #endregion

        #region constructor
        public RateSheet_Handling_SKU()
        {
        }
        #endregion

        #region internal methods
        internal static List<RateSheet_Handling_SKU> Get(int rateSheetId)
        {
            List<RateSheet_Handling_SKU> skus = new List<RateSheet_Handling_SKU>();
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Handling_SKU"))
                {
                    db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                skus.Add(new RateSheet_Handling_SKU
                                {
                                    RSHId = Convert.ToInt16(dr["RSHId"]),
                                    SKUCode = dr["SKU"].ToString(),
                                    MinUnit = Convert.ToDecimal(dr["MinUnit"])
                                });
                            }
                        }
                    }
                }
            }
            return skus;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}
