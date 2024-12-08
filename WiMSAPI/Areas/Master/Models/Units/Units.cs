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
    public class Units : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short UnitId { get; set; }
        public string UnitName { get; set; }
        #endregion

        #region constructor
        public Units()
        {

        }
        #endregion

        #region internal methods
        internal static List<Units> GetHandling(bool onlyLTL = false)
        {
            try
            {
                List<Units> unittypes = new List<Units>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetHandlingUnits"))
                {
                    db.AddInParameter(dbCommand, "OnlyLTL", SqlDbType.Bit, onlyLTL);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                unittypes.Add(new Units
                                {
                                    UnitId = Convert.ToInt16(dr["HUId"]),
                                    UnitName = dr["HUName"].ToString()
                                });
                            }
                        }
                    }
                }
                return unittypes;
            }
            catch (Exception) { throw; }
        }

        internal static List<Units> GetStorage()
        {
            try
            {
                List<Units> unittypes = new List<Units>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetStorageUnits"))
                {
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                unittypes.Add(new Units
                                {
                                    UnitId = Convert.ToInt16(dr["SUId"]),
                                    UnitName = dr["SUName"].ToString()
                                });
                            }
                        }
                    }
                }
                return unittypes;
            }
            catch (Exception) { throw; }
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