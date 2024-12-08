using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class WF_RateSheet_Handling_SKU : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WHSId { get; set; }
        public short? WRSHId { get; set; }
        public short? HSId { get; set; }
        public string SKUCode { get; set; }
        public decimal MinUnit { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_Handling_SKU()
        {
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_Handling_SKU> Get(int formId)
        {
            List<WF_RateSheet_Handling_SKU> skus = new List<WF_RateSheet_Handling_SKU>();
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_Handling_SKU"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                skus.Add(new WF_RateSheet_Handling_SKU
                                {
                                    WHSId = agHelper.sDBNull(dr["WHSId"]),
                                    WRSHId = Convert.ToInt16(dr["WRSHId"]),
                                    HSId = agHelper.sDBNull(dr["HSId"]),
                                    SKUCode = dr["SKU"].ToString(),
                                    MinUnit = Convert.ToDecimal(dr["MinUnit"]),
                                    Action = dr["Action"].ToString(),
                                    Add = false
                                });
                            }
                        }
                    }
                }
            }
            return skus;
        }

        internal static bool Save(int rshId, List<WF_RateSheet_Handling_SKU> detail, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Handling_SKU rshs in agHelper.GetChanges(detail))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_Handling_SKU"))
                    {
                        db.AddInParameter(dbCommand, "WHSId", SqlDbType.SmallInt, rshs.WHSId);
                        db.AddInParameter(dbCommand, "WRSHId", SqlDbType.SmallInt, rshId);
                        db.AddInParameter(dbCommand, "HSId", SqlDbType.Int, rshs.HSId);
                        db.AddInParameter(dbCommand, "SKUCode", SqlDbType.VarChar, rshs.SKUCode);//sl.SKU.SKUId);
                        db.AddInParameter(dbCommand, "MinUnit", SqlDbType.Decimal, rshs.MinUnit);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rshs.Delete ? "D" : (rshs.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }

        internal static List<WF_RateSheet_Handling_SKU> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_Handling_SKU> skus = new List<WF_RateSheet_Handling_SKU>();
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
                                skus.Add(new WF_RateSheet_Handling_SKU
                                {
                                    //DetailId = Convert.ToInt16(dr["WHSId"]),
                                    WRSHId = Convert.ToInt16(dr["RSHId"]),
                                    HSId = Convert.ToInt16(dr["HSId"]),
                                    SKUCode = dr["SKU"].ToString(),
                                    MinUnit = Convert.ToDecimal(dr["MinUnit"]),
                                    //Action = dr["Action"].ToString(),
                                    Add = false
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
