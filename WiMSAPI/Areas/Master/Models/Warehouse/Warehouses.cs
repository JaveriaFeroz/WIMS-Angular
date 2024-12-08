using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public class Warehouses : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short WHId { get; set; }
        public string WHName { get; set; }
        #endregion

        #region constructor
        public Warehouses()
        {
        }
        #endregion

        #region internal methods
        internal static List<Warehouses> Get(string userId)
        {
            List<Warehouses> warehouses = new List<Warehouses>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetWarehouses"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            warehouses.Add(new Warehouses
                            {
                                WHId = Convert.ToInt16(dr["WHId"]),
                                WHName = dr["WHName"].ToString()
                            });
                        }
                    }
                }
            }
            return warehouses;
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