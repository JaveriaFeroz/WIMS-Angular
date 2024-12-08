using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class RateSheet_Storage : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSSId { get; set; }
        public string DateFrom { get; set; } 
        public string DateTo { get; set; }
        public string SUName { get; set; }
        public string STName { get; set; }
        public decimal Rate { get; set; } = 0;
        public decimal OTRate { get; set; } = 0;
        public decimal FixedSqFt { get; set; } = 0;
        public decimal MinVolume { get; set; } = 0;
        public decimal MinAmount { get; set; } = 0;
        public string PeriodTypeName { get; set; }
        public bool StepCharges { get; set; }
        public bool IsVisible { get; set; }
        public List<RateSheet_Storage_LocCategory> LocationCategory { get; set; } = new List<RateSheet_Storage_LocCategory>();
        #endregion

        #region constructor
        public RateSheet_Storage()
        {
        }
        #endregion

        #region internal methods
        internal static List<RateSheet_Storage> Get(int rateSheetId)
        {
            List<RateSheet_Storage> storagerates = new List<RateSheet_Storage>();
            List<RateSheet_Storage_LocCategory> categories = RateSheet_Storage_LocCategory.Get(rateSheetId);
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Storage"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            storagerates.Add(new RateSheet_Storage
                            {
                                RSSId = Convert.ToInt16(dr["RSSId"]),
                                DateFrom = dr["DateFrom"].ToString(),
                                DateTo = dr["DateTo"].ToString(),
                                STName = dr["STName"].ToString(),
                                SUName = dr["SUName"].ToString(),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                OTRate = Convert.ToDecimal(dr["OTRate"]),
                                FixedSqFt = Convert.ToDecimal(dr["FixedSqFt"]),
                                MinVolume = Convert.ToDecimal(dr["MinVolume"]),
                                MinAmount = Convert.ToDecimal(dr["MinAmount"]),
                                PeriodTypeName = dr["PeriodTypeName"].ToString(),
                                StepCharges = Convert.ToBoolean(dr["StepCharges"]),
                                LocationCategory = categories.Where(x=>x.RSSId == Convert.ToInt32(dr["RSSId"])).ToList(),
                                IsVisible = Convert.ToBoolean(dr["IsVisible"])
                            });
                        }
                    }
                }
            }
            return storagerates;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}