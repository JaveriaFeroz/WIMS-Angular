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
    public class StorageTypes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public StorageTypes()
        {

        }
        #endregion

        #region internal methods
        internal static List<StorageTypes> Get()
        {
            try
            {
                List<StorageTypes> storagetypes = new List<StorageTypes>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetStorageTypes"))
                {
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                storagetypes.Add(new StorageTypes
                                {
                                    TypeId = Convert.ToInt16(dr["STId"]),
                                    TypeName = dr["STName"].ToString()
                                });
                            }
                        }
                    }
                }
                return storagetypes;
            }
            catch (Exception) { throw; }
        }
        #endregion

        public void Dispose()
        {
        }
    }
}
