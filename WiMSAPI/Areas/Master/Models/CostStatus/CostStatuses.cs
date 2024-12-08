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
    public class CostStatuses : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short StatusId { get; set; }
        public string StatusName { get; set; }
        #endregion

        #region constructor
        public CostStatuses()
        {

        }
        #endregion

        #region internal methods
        internal static List<CostStatuses> Get()
        {
            List<CostStatuses> billstatus = new List<CostStatuses>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCostStatuses"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds!=null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            billstatus.Add(new CostStatuses
                            {
                                StatusId = Convert.ToInt16(dr["StatusId"]),
                                StatusName = dr["StatusName"].ToString()
                            });
                        }
                    }
                }
            }
            return billstatus;
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