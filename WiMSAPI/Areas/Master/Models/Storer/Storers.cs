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
    public class Storers : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string StorerKey {get;set;}
        public string StorerName {get;set;}
        #endregion

        #region constructor
        public Storers()
        {
        }
        #endregion

        #region internal methods
        public static List<Storers> Get()
        {
            List<Storers> storers = new List<Storers>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetStorers"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            storers.Add(new Storers
                            {
                                StorerKey = dr["StorerKey"].ToString(),
                                StorerName = dr["StorerName"].ToString()
                            });
                        }
                       
                    }
                }
            }
            return storers;
        }
        #endregion

        #region idisposal member
        public void Dispose()
        {
        }
        #endregion
    }
}
