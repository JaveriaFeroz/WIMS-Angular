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
    public class ContainerTypes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public ContainerTypes()
        {
        }
        #endregion

        #region internal methods
        internal static List<ContainerTypes> Get()
        {
            List<ContainerTypes> containertypes = new List<ContainerTypes>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetContainerTypes"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            containertypes.Add(new ContainerTypes
                            {
                                TypeId = Convert.ToInt16(dr["TypeId"]),
                                TypeName = dr["TypeName"].ToString()
                            });
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
            // no implementation
        }
        #endregion
    }
}