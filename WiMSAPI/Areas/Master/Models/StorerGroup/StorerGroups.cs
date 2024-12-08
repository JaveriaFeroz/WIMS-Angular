using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public class StorerGroups : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short GroupId { get; set; }
        public string GroupName { get; set; }
        #endregion

        #region constructor
        public StorerGroups()
        {
        }
        #endregion

        #region internal methods
        internal static List<StorerGroups> Get()
        {
            return get("GetStorerGroups");
        }

        internal static List<StorerGroups> GetForVariableSqFt()
        {
            return get("GetStorerGroupsForVariableSqFt");
        }
        #endregion

        #region private methods
        private static List<StorerGroups> get(string spName)
        {
            List<StorerGroups> storergroups = new List<StorerGroups>();
            using (DbCommand dbCommand = db.GetStoredProcCommand(spName))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            storergroups.Add(new StorerGroups
                            {
                                GroupId = Convert.ToInt16(dr["StorerGroupId"]),
                                GroupName = dr["StorerGroupName"].ToString()
                            });
                        }
                    }
                }
            }
            return storergroups;
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {
            //
        }
        #endregion
    }
}