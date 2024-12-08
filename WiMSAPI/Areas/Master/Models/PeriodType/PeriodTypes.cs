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
    public class PeriodTypes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        #endregion
               
        #region constructor
        public PeriodTypes()
        {

        }
        #endregion

        #region internal methods
        public static List<PeriodTypes> Get()
        {
            try
            {
                List<PeriodTypes> periodtypes = new List<PeriodTypes>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetPeriodTypes"))
                {
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                periodtypes.Add(new PeriodTypes
                                {
                                    TypeId = Convert.ToInt16(dr["TypeId"]),
                                    TypeName = dr["TypeName"].ToString()
                                });
                            }
                        }
                    }
                }
                return periodtypes;
            }
            catch (Exception) { throw; }
        }
        #endregion

        public void Dispose()
        {
        }
    }
}