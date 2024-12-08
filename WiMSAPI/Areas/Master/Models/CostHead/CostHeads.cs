using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class CostHeads : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties       
        public short HeadId { get; set; }  
        public string HeadName { get; set; }      
        public string ChargeCode { get; set; }
        #endregion

        #region constructor
        public CostHeads()
        {

        }
        #endregion

        #region internal methods
        internal static List<CostHeads> Get(bool activeOnly = true)
        {
            List<CostHeads> costheads = new List<CostHeads>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCostHeads"))
            {
                db.AddInParameter(dbCommand, "activeonly", SqlDbType.Bit, Convert.ToInt16(activeOnly));
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds!=null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            costheads.Add(new CostHeads
                            {
                                HeadId = Convert.ToInt16(dr["HeadId"]),
                                HeadName = dr["HeadName"].ToString(),
                                ChargeCode = dr["ControlChargeCode"].ToString()
                            });
                        }
                    }
                }
            }
            return costheads;
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