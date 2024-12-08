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
    public class WF_RateSheet_Handling : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSHId { get; set; }
        public short? WRSHId { get; set; }
        public DateTime? DateFrom { get; set; } 
        public DateTime? DateTo { get; set; } 
        public short? HTId { get; set; }
        public short? HUId { get; set; }
        public decimal Rate { get; set; }
        public decimal SundayRate { get; set; }
        public decimal HolidayRate { get; set; }
        public decimal MinVolume { get; set; }
        public decimal MinAmount { get; set; }
        public short? LooseUnitId { get; set; }
        public decimal? LooseRate { get; set; }
        public bool UniquePalletCount { get; set; }
        public List<WF_RateSheet_Handling_ContainerType> ContainerRates { get; set; } = new List<WF_RateSheet_Handling_ContainerType>();
        public List<WF_RateSheet_Handling_SKU> SKUs { get; set; } = new List<WF_RateSheet_Handling_SKU>();
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        //public bool NoChange { get; set; } = true;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_Handling()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_Handling> Get(int formId)
        {
            List<WF_RateSheet_Handling> handlingRates = new List<WF_RateSheet_Handling>();
            List<WF_RateSheet_Handling_ContainerType> containerTypes = WF_RateSheet_Handling_ContainerType.Get(formId);
            List<WF_RateSheet_Handling_SKU> skus = WF_RateSheet_Handling_SKU.Get(formId);
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_Handling"))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.Int, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            handlingRates.Add(new WF_RateSheet_Handling
                            {
                                WRSHId = agHelper.sDBNull(dr["WRSHId"]),
                                RSHId = agHelper.sDBNull(dr["RSHId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"]),
                                HTId = Convert.ToInt16(dr["HandlingTypeId"]),
                                HUId = Convert.ToInt16(dr["HandlingUnitId"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                SundayRate = Convert.ToDecimal(dr["SundayRate"]),
                                HolidayRate = Convert.ToDecimal(dr["HolidayRate"]),
                                MinVolume = Convert.ToDecimal(dr["MinVolume"]),
                                MinAmount = Convert.ToDecimal(dr["MinAmount"]),
                                LooseUnitId = agHelper.sDBNull(dr["LooseUnitId"]),
                                LooseRate = agHelper.dDBNull(dr["LooseRate"]),
                                UniquePalletCount = Convert.ToBoolean(dr["UniquePallets"]),
                                ContainerRates = Convert.ToInt16(dr["HandlingUnitId"]) == 54 ? 
                                containerTypes.Where(x =>
                                agHelper.sDBNull(dr["WRSHId"]).HasValue ?
                                    x.WRSHId == agHelper.NVL(dr[x.WHCId.HasValue ? "WRSHId" : "RSHId"], 0) ://Convert.ToInt16(dr[x.WHCId.HasValue ? "WRSHId" : "RSHId"]) :
                                    x.WRSHId == agHelper.NVL(dr["RSHId"], 0)).ToList() : new List<WF_RateSheet_Handling_ContainerType>(),//Convert.ToInt16(dr["RSHId"])
                                SKUs = Convert.ToInt16(dr["HandlingUnitId"]) == 56 ?
                                skus.Where(x =>
                                agHelper.sDBNull(dr["WRSHId"]).HasValue ?
                                    x.WRSHId == agHelper.NVL(dr[x.WHSId.HasValue ? "WRSHId" : "RSHId"], 0) ://Convert.ToInt16(dr[x.WHSId.HasValue ? "WRSHId" : "RSHId"]) :
                                    x.WRSHId == agHelper.NVL(dr["RSHId"], 0)).ToList() : new List<WF_RateSheet_Handling_SKU>(),//Convert.ToInt16(dr["RSHId"])
                                Add = false,
                                Action = dr["Action"].ToString()
                            });
                        }
                    }
                }
            }
            return handlingRates;
        }

        internal static bool Save(int formId, List<WF_RateSheet_Handling> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Handling rsh in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_Handling"))
                    {
                        db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                        db.AddInParameter(dbCommand, "WRSHId", SqlDbType.Int, rsh.WRSHId);
                        db.AddInParameter(dbCommand, "RSHId", SqlDbType.SmallInt, rsh.RSHId);
                        db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, rsh.DateFrom);
                        db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, rsh.DateTo);
                        db.AddInParameter(dbCommand, "HandlingTypeId", SqlDbType.SmallInt, rsh.HTId);
                        db.AddInParameter(dbCommand, "HandlingUnitId", SqlDbType.SmallInt, rsh.HUId);
                        db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, rsh.Rate);
                        db.AddInParameter(dbCommand, "SundayRate", SqlDbType.Decimal, rsh.SundayRate);
                        db.AddInParameter(dbCommand, "HolidayRate", SqlDbType.Decimal, rsh.HolidayRate);
                        db.AddInParameter(dbCommand, "MinVolume", SqlDbType.Decimal, rsh.MinVolume);
                        db.AddInParameter(dbCommand, "MinAmount", SqlDbType.Decimal, rsh.MinAmount);
                        db.AddInParameter(dbCommand, "LooseUnitId", SqlDbType.SmallInt, rsh.LooseUnitId);
                        db.AddInParameter(dbCommand, "LooseRate", SqlDbType.Decimal, rsh.LooseRate);
                        db.AddInParameter(dbCommand, "UniquePallets", SqlDbType.Bit, rsh.UniquePalletCount);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        //db.AddInParameter(dbCommand, "NoChange", SqlDbType.Bit, rsh.NoChange);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                          rsh.Delete ? "D" : (rsh.Add ? "I" : "U")));
                        db.AddOutParameter(dbCommand, "NewWRSHId", SqlDbType.Int, 32);
                        db.ExecuteNonQuery(dbCommand, transaction);
                        rsh.WRSHId = Convert.ToInt16(dbCommand.Parameters["@NewWRSHId"].Value);

                        #region Handling Charges For Container
                        if (rsh.HUId == agEnums.ContainerHandling)
                        {
                            if (rsh.Delete == true)
                            {
                                rsh.ContainerRates.ForEach(o => o.Delete = true);
                            }
                            WF_RateSheet_Handling_ContainerType.Save(rsh.WRSHId.Value, rsh.ContainerRates, userId, transaction);
                        }
                        #endregion

                        #region Handling detail for SKU
                        if (rsh.HUId == agEnums.HandlingBySKU)
                        {
                            if (rsh.Delete == true)
                            {
                                rsh.SKUs.ForEach(o => o.Delete = true);
                            }
                            WF_RateSheet_Handling_SKU.Save(rsh.WRSHId.Value, rsh.SKUs, userId, transaction);
                        }
                        #endregion
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }

        internal static List<WF_RateSheet_Handling> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_Handling> handlingRates = new List<WF_RateSheet_Handling>();
            List<WF_RateSheet_Handling_ContainerType> containerTypes = WF_RateSheet_Handling_ContainerType.GetExisting(rateSheetId);
            List<WF_RateSheet_Handling_SKU> skus = WF_RateSheet_Handling_SKU.GetExisting(rateSheetId);
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Handling"))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.Int, rateSheetId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            handlingRates.Add(new WF_RateSheet_Handling
                            {
                                //DetailId = Convert.ToInt16(dr["DetailId"]),
                                RSHId = Convert.ToInt16(dr["RSHId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"]),
                                HTId = Convert.ToInt16(dr["HandlingTypeId"]),
                                HUId = Convert.ToInt16(dr["HandlingUnitId"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                SundayRate = Convert.ToDecimal(dr["SundayRate"]),
                                HolidayRate = Convert.ToDecimal(dr["HolidayRate"]),
                                MinVolume = Convert.ToDecimal(dr["MinVolume"]),
                                MinAmount = Convert.ToDecimal(dr["MinAmount"]),
                                LooseUnitId = agHelper.sDBNull(dr["LooseUnitId"]),
                                LooseRate = agHelper.dDBNull(dr["LooseRate"]),
                                UniquePalletCount = Convert.ToBoolean(dr["UniquePallets"]),
                                ContainerRates = containerTypes.Where(x => x.WRSHId == Convert.ToInt16(dr["RSHId"])).ToList(),
                                SKUs = skus.Where(x => x.WRSHId == Convert.ToInt16(dr["RSHId"])).ToList(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return handlingRates;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}