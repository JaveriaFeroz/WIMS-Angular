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
    public class HandlingTypes : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short TypeId { get; set; }
        public string TypeName { get; set; }
        #endregion

        #region constructor
        public HandlingTypes()
        {

        }
        #endregion

        #region internal methods
        internal static List<HandlingTypes> Get()
        {
            try
            {
                List<HandlingTypes> handlingtypes = new List<HandlingTypes>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetHandlingTypes"))
                {
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                handlingtypes.Add(new HandlingTypes
                                {
                                    TypeId = Convert.ToInt16(dr["HTId"]),
                                    TypeName = dr["HTName"].ToString()
                                });
                            }
                        }
                    }
                }
                return handlingtypes;
            }
            catch (Exception) { throw; }
        }
        #endregion

        public void Dispose()
        {
        }
    }
}