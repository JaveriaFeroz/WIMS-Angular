using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Master.Models
{
    public class KAMs : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties     
        public short KAMId { get; set; }      
        public string KAMName { get; set; }     
        public bool IsActive { get; set; }
        #endregion

        #region constructor
        public KAMs()
        {

        }
        #endregion

        #region internal method
        internal static List<KAMs> Get(bool activeOnly = true)
        {
            List<KAMs> kams = new List<KAMs>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetKAMs"))
            {
                db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                {
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            kams.Add(new KAMs
                            {
                                KAMId = Convert.ToInt16(dr["KAMId"]),
                                KAMName = dr["KAMName"].ToString(),
                                IsActive = Convert.ToBoolean(dr["IsActive"])
                            });
                        }
                    }
                }
            }
            return kams;
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