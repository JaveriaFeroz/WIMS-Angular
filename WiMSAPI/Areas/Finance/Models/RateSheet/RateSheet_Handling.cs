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
    public class RateSheet_Handling : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSHId { get; set; }
        public string DateFrom { get; set; } 
        public string DateTo { get; set; } 
        public string HTName { get; set; }
        public string HUName { get; set; }
        public decimal Rate { get; set; }
        public decimal SundayRate { get; set; }
        public decimal HolidayRate { get; set; }
        public decimal MinVolume { get; set; }
        public decimal MinAmount { get; set; }
        public string LooseUnitName { get; set; }
        public decimal? LooseRate { get; set; }
        public bool UniquePalletCount { get; set; }
        public List<RateSheet_Handling_ContainerType> ContainerRate { get; set; } = new List<RateSheet_Handling_ContainerType>();
        public List<RateSheet_Handling_SKU> SKUs { get; set; } = new List<RateSheet_Handling_SKU>();
        #endregion

        #region constructor
        public RateSheet_Handling()
        {
        }      
        #endregion

        #region internal methods
        internal static List<RateSheet_Handling> Get(int rateSheetId)
        {
            List<RateSheet_Handling> handlingrates = new List<RateSheet_Handling>();
            List<RateSheet_Handling_ContainerType> containertypes = RateSheet_Handling_ContainerType.Get(rateSheetId);
            List<RateSheet_Handling_SKU> skus = RateSheet_Handling_SKU.Get(rateSheetId);
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Handling"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            handlingrates.Add(new RateSheet_Handling
                            {
                                RSHId = Convert.ToInt16(dr["RSHId"]),
                                DateFrom = dr["DateFrom"].ToString(),
                                DateTo = dr["DateTo"].ToString(),
                                HTName = dr["HTName"].ToString(),
                                HUName = dr["HUName"].ToString(),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                SundayRate = Convert.ToDecimal(dr["SundayRate"]),
                                HolidayRate = Convert.ToDecimal(dr["HolidayRate"]),
                                MinVolume = Convert.ToDecimal(dr["MinVolume"]),
                                MinAmount = Convert.ToDecimal(dr["MinAmount"]),
                                LooseUnitName = dr["LooseUnitName"].ToString(),                                                      
                                LooseRate = Convert.ToDecimal(dr["LooseRate"]),
                                UniquePalletCount = Convert.ToBoolean(dr["UniquePallets"]),
                                ContainerRate = containertypes.Where(x => x.RSHId == Convert.ToInt16(dr["RSHId"])).ToList(),
                                SKUs = skus.Where(x => x.RSHId == Convert.ToInt16(dr["RSHId"])).ToList(),
                            });
                        }
                    }
                }
            }
            return handlingrates;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}