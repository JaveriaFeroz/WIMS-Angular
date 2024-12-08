using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class WF_RateSheet_Storage : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WRSSId { get; set; }
        public short? RSSId { get; set; }
        public DateTime? DateFrom { get; set; } 
        public DateTime? DateTo { get; set; }
        public short? SUId { get; set; }
        public short? STId { get; set; }
        public decimal Rate { get; set; } = 0;
        public decimal OTRate { get; set; } = 0;
        public decimal FixedSqFt { get; set; } = 0;
        public decimal MinVolume { get; set; } = 0;
        public decimal MinAmount { get; set; } = 0;
        public short? PeriodTypeId { get; set; } = 2;
        public bool StepCharges { get; set; } = false;
        public bool IsVisible { get; set; } = true;
        public List<WF_RateSheet_Storage_LocCategory> LocationCategory { get; set; } = new List<WF_RateSheet_Storage_LocCategory>();
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        //public bool NoChange { get; set; } = true;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_Storage()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_Storage> Get(int formId)
        {
            List<WF_RateSheet_Storage> storageRates = new List<WF_RateSheet_Storage>();
            List<WF_RateSheet_Storage_LocCategory> categories = WF_RateSheet_Storage_LocCategory.Get(formId);
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_Storage"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            storageRates.Add(new WF_RateSheet_Storage
                            {
                                WRSSId = agHelper.sDBNull(dr["WRSSId"]),
                                RSSId = agHelper.sDBNull(dr["RSSId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"]),
                                STId = Convert.ToInt16(dr["StorageTypeId"]),
                                SUId = Convert.ToInt16(dr["StorageUnitId"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                OTRate = Convert.ToDecimal(dr["OTRate"]),
                                FixedSqFt = Convert.ToDecimal(dr["FixedSqFt"]),
                                MinVolume = Convert.ToDecimal(dr["MinVolume"]),
                                MinAmount = Convert.ToDecimal(dr["MinAmount"]),
                                PeriodTypeId = Convert.ToInt16(dr["PeriodTypeId"]),
                                StepCharges = Convert.ToBoolean(dr["StepCharges"]),
                                LocationCategory = categories.Where(x =>
                                    agHelper.sDBNull(dr["WRSSId"]).HasValue ? 
                                    x.WRSSId == agHelper.NVL(dr[x.WSLCId.HasValue ? "WRSSId" : "RSSId"], 0) : //Convert.ToInt16(dr[x.WSLCId.HasValue ? "WRSSId" : "RSSId"]) : 
                                    x.WRSSId == agHelper.NVL(dr["RSSId"], 0)).ToList(),
                                IsVisible = Convert.ToBoolean(dr["IsVisible"]),
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return storageRates;
        }

        internal static bool Save(int formId, List<WF_RateSheet_Storage> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Storage rss in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_Storage"))
                    {
                        db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                        db.AddInParameter(dbCommand, "WRSSId", SqlDbType.SmallInt, rss.WRSSId);
                        db.AddInParameter(dbCommand, "RSSId", SqlDbType.SmallInt, rss.RSSId);
                        db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, rss.DateFrom);
                        db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, rss.DateTo);
                        db.AddInParameter(dbCommand, "StorageTypeId", SqlDbType.SmallInt, rss.STId);
                        db.AddInParameter(dbCommand, "StorageUnitId", SqlDbType.SmallInt, rss.SUId);
                        db.AddInParameter(dbCommand, "PeriodTypeId", SqlDbType.SmallInt, rss.PeriodTypeId);
                        db.AddInParameter(dbCommand, "FixedSqFt", SqlDbType.Int, rss.FixedSqFt);
                        db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, rss.Rate);
                        db.AddInParameter(dbCommand, "OTRate", SqlDbType.Decimal, rss.SUId == (int)agEnums.StorageUnit.VariableSqFt ? rss.OTRate : 0);
                        db.AddInParameter(dbCommand, "MinVolume", SqlDbType.Decimal, rss.MinVolume);
                        db.AddInParameter(dbCommand, "MinAmount", SqlDbType.Decimal, rss.MinAmount);
                        db.AddInParameter(dbCommand, "StepCharges", SqlDbType.Bit, rss.StepCharges);
                        db.AddInParameter(dbCommand, "IsVisible", SqlDbType.Bit, rss.IsVisible);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rss.Delete ? "D" : (rss.Add ? "I" : "U" )));
                        db.AddOutParameter(dbCommand, "NewWRSSId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        rss.WRSSId = Convert.ToInt16(dbCommand.Parameters["@NewWRSSId"].Value);
                        if (rss.SUId != agEnums.FixedSqFt && rss.SUId != agEnums.VariableSqFt && rss.LocationCategory.Count > 0)
                        {
                            if (rss.Delete == true)
                            {
                                rss.LocationCategory.ForEach(o => o.Delete = true);
                            }
                            WF_RateSheet_Storage_LocCategory.Save(rss.WRSSId.Value, rss.LocationCategory, userId, transaction);
                        }
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }

        internal static List<WF_RateSheet_Storage> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_Storage> storagerates = new List<WF_RateSheet_Storage>();
            List<WF_RateSheet_Storage_LocCategory> categories = WF_RateSheet_Storage_LocCategory.GetExisting(rateSheetId);
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Storage"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            storagerates.Add(new WF_RateSheet_Storage
                            {
                                //DetailId = Convert.ToInt16(dr["DetailId"]),
                                RSSId = Convert.ToInt16(dr["RSSId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"].ToString()),
                                STId = Convert.ToInt16(dr["StorageTypeId"]),
                                SUId = Convert.ToInt16(dr["StorageUnitId"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                OTRate = Convert.ToDecimal(dr["OTRate"]),
                                FixedSqFt = Convert.ToDecimal(dr["FixedSqFt"]),
                                MinVolume = Convert.ToDecimal(dr["MinVolume"]),
                                MinAmount = Convert.ToDecimal(dr["MinAmount"]),
                                PeriodTypeId = Convert.ToInt16(dr["PeriodTypeId"]),
                                StepCharges = Convert.ToBoolean(dr["StepCharges"]),
                                LocationCategory = categories.Where(x => x.WRSSId == Convert.ToInt32(dr["RSSId"])).ToList(),
                                IsVisible = Convert.ToBoolean(dr["IsVisible"]),
                                Add = false
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