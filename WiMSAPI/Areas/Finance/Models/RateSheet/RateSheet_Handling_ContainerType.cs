using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Finance.Models
{
    public class RateSheet_Handling_ContainerType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? RSHId { get; set; }
        public string ContainerTypeName { get; set; }
        public decimal Rate { get; set; }
        #endregion

        #region constructor
        public RateSheet_Handling_ContainerType()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<RateSheet_Handling_ContainerType> Get(int rateSheetId)
        {
            List<RateSheet_Handling_ContainerType> containertypes = new List<RateSheet_Handling_ContainerType>();
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
                                containertypes.Add(new RateSheet_Handling_ContainerType
                                {
                                    RSHId = Convert.ToInt16(dr["RSHId"]),                                    
                                    ContainerTypeName = dr["ContainerTypeName"].ToString(),
                                    Rate = Convert.ToDecimal(dr["Rate"])
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
