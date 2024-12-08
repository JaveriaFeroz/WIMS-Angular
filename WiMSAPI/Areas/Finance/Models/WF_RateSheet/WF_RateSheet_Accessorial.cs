using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    [DataContract]
    public class WF_RateSheet_Accessorial : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WACRateId { get; set; }
        public short? ACRateId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; } 
        public short? ChargeId { get; set; }
        public decimal Rate { get; set; }
        public decimal? Qty { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_Accessorial()
        {

        }
        #endregion

        #region internal method
        internal static List<WF_RateSheet_Accessorial> GetFixed(int formId)
        {
            return get("GetWF_RateSheet_FixedAccessorial", formId);
        }

        internal static List<WF_RateSheet_Accessorial> GetVariable(int formId)
        {
            return get("GetWF_RateSheet_VariableAccessorial", formId);
        }

        internal static bool SaveFixed(int formId, List<WF_RateSheet_Accessorial> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Accessorial rsa in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_FixedAccessorial"))
                    {
                        db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                        db.AddInParameter(dbCommand, "WACRateId", SqlDbType.SmallInt, rsa.WACRateId);
                        db.AddInParameter(dbCommand, "ACRateId", SqlDbType.SmallInt, rsa.ACRateId);
                        db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, rsa.ChargeId);
                        db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, rsa.DateFrom);
                        db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, rsa.DateTo);
                        db.AddInParameter(dbCommand, "Rate", DbType.Decimal, rsa.Rate);
                        db.AddInParameter(dbCommand, "Qty", SqlDbType.Decimal, rsa.Qty);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rsa.Delete ? "D" : (rsa.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }

        internal static bool SaveVariable(int formId, List<WF_RateSheet_Accessorial> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Accessorial rsa in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_VariableAccessorial"))
                    {                     
                        db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                        db.AddInParameter(dbCommand, "WACRateId", SqlDbType.SmallInt, rsa.WACRateId);
                        db.AddInParameter(dbCommand, "ACRateId", SqlDbType.SmallInt, rsa.ACRateId);
                        db.AddInParameter(dbCommand, "ChargeId", SqlDbType.SmallInt, rsa.ChargeId);
                        db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime,rsa.DateFrom);
                        db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, rsa.DateTo);
                        db.AddInParameter(dbCommand, "Rate", DbType.Decimal, rsa.Rate);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rsa.Delete ? "D" : (rsa.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }

        internal static List<WF_RateSheet_Accessorial> GetExistingFixed(int rateSheetId)
        {
            return getExisting("GetRateSheet_FixedAccessorial", rateSheetId);
        }

        internal static List<WF_RateSheet_Accessorial> GetExistingVariable(int rateSheetId)
        {
            return getExisting("GetRateSheet_VariableAccessorial", rateSheetId);
        }
        #endregion

        #region private methods
        private static List<WF_RateSheet_Accessorial> get(string spName, int formId)
        {
            List<WF_RateSheet_Accessorial> accessorials = new List<WF_RateSheet_Accessorial>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
            {
                db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            accessorials.Add(new WF_RateSheet_Accessorial
                            {
                                WACRateId = agHelper.sDBNull(dr["WACRateId"]),
                                ACRateId = agHelper.sDBNull(dr["ACRateId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"]),
                                ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                Qty = agHelper.dDBNull(dr["Qty"]),
                                Action = dr["Action"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return accessorials;
        }

        private static List<WF_RateSheet_Accessorial> getExisting(string spName, int requestId)
        {
            List<WF_RateSheet_Accessorial> accessorials = new List<WF_RateSheet_Accessorial>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
            {
                db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, requestId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            accessorials.Add(new WF_RateSheet_Accessorial
                            {
                                //DetailId = Convert.ToInt16(dr["DetailId"]),
                                ACRateId = Convert.ToInt16(dr["RSAId"]),
                                DateFrom = Convert.ToDateTime(dr["DateFrom"]),
                                DateTo = Convert.ToDateTime(dr["DateTo"]),
                                ChargeId = Convert.ToInt16(dr["ChargeId"]),
                                Rate = Convert.ToDecimal(dr["Rate"]),
                                Qty = agHelper.dDBNull(dr["Qty"]),
                                //Action= dr["Action"].ToString(),
                                Add = false
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
