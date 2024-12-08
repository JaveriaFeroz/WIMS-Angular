using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Finance.Models
{
    public class WF_RateSheet_Handling_ContainerType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? WHCId { get; set; }
        public short? WRSHId { get; set; }
        public short? HCId { get; set; }
        public short? ContainerTypeId { get; set; }
        public decimal Rate { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        public string Action { get; set; } = "N";
        #endregion

        #region constructor
        public WF_RateSheet_Handling_ContainerType()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<WF_RateSheet_Handling_ContainerType> Get(int formId)
        {
            List<WF_RateSheet_Handling_ContainerType> containertypes = new List<WF_RateSheet_Handling_ContainerType>();
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetWF_RateSheet_Handling_ContainerType"))
                {
                    db.AddInParameter(dbCommand, "FormId", SqlDbType.SmallInt, formId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                containertypes.Add(new WF_RateSheet_Handling_ContainerType
                                {
                                    WHCId = agHelper.sDBNull(dr["WHCId"]),
                                    WRSHId = Convert.ToInt16(dr["WRSHId"]),
                                    HCId = agHelper.sDBNull(dr["HCId"]),
                                    ContainerTypeId = Convert.ToInt16(dr["ContainerTypeId"]),
                                    Rate = Convert.ToDecimal(dr["Rate"]),
                                    Action = dr["Action"].ToString(),
                                    Add = false
                                });
                            }
                        }
                    }
                }
            }
            return containertypes;
        }

        internal static bool Save(short rshId, List<WF_RateSheet_Handling_ContainerType> detail, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (WF_RateSheet_Handling_ContainerType rhct in agHelper.GetChanges(detail))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveWF_RateSheet_Handling_ContainerType"))
                    {
                        db.AddInParameter(dbCommand, "WRSHId", SqlDbType.SmallInt, rshId);
                        db.AddInParameter(dbCommand, "WHCId", SqlDbType.SmallInt, rhct.WHCId);
                        db.AddInParameter(dbCommand, "HCId", SqlDbType.SmallInt, rhct.HCId);
                        db.AddInParameter(dbCommand, "ContainerTypeId", SqlDbType.Int, rhct.ContainerTypeId);
                        db.AddInParameter(dbCommand, "Rate", SqlDbType.Decimal, rhct.Rate);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (rhct.Delete ? "D" : (rhct.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch(Exception) { throw; }
        }

        internal static List<WF_RateSheet_Handling_ContainerType> GetExisting(int rateSheetId)
        {
            List<WF_RateSheet_Handling_ContainerType> containertypes = new List<WF_RateSheet_Handling_ContainerType>();
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetRateSheet_Handling_ContainerType"))
                {
                    db.AddInParameter(dbCommand, "RateSheetId", SqlDbType.SmallInt, rateSheetId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                containertypes.Add(new WF_RateSheet_Handling_ContainerType
                                {
                                    //DetailId = Convert.ToInt16(dr["DetailId"]),
                                    WRSHId = Convert.ToInt16(dr["RSHId"]),
                                    HCId = Convert.ToInt16(dr["HCId"]),
                                    ContainerTypeId = Convert.ToInt16(dr["ContainerTypeId"]),
                                    Rate = Convert.ToDecimal(dr["Rate"]),
                                    //Action = dr["Action"].ToString(),
                                    Add = false
                                });
                            }
                        }
                    }
                }
            }
            return containertypes;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}
