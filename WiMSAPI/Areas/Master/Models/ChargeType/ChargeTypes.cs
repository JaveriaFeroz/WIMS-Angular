using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public class ChargeTypes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        public string ChargeCode { get; set; }
        #endregion

        #region constructor
        public ChargeTypes()
        {

        }
        #endregion

        #region internal methods
        internal static List<ChargeTypes> Get()
        {
            List<ChargeTypes> expenseheads = new List<ChargeTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetChargeTypes"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            expenseheads.Add(new ChargeTypes
                            {
                                TypeId = Convert.ToInt16(dr["ChargeTypeId"]),
                                TypeName = dr["ChargeTypeName"].ToString(),
                                ChargeCode = dr["ControlChargeCode"].ToString()
                            });
                        }
                    }
                }
            }
            return expenseheads;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            // no implementation
        }
        #endregion
    }
}