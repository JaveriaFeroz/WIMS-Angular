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
    public class DayTypes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public DayTypes()
        {

        }
        #endregion

        #region internal methods
        internal static List<DayTypes> Get()
        {
            try
            {
                List<DayTypes> daytypes = new List<DayTypes>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetDayTypes"))
                {
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                daytypes.Add(new DayTypes
                                {
                                    TypeId = Convert.ToInt16(dr["DayTypeId"]),
                                    TypeName = dr["DayTypeName"].ToString()
                                });
                            }
                        }
                    }
                }
                return daytypes;
            }
            catch (Exception) { throw; }
        }
        #endregion

        public void Dispose()
        {
        }
    }
}