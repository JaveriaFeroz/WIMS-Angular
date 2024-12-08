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
    public class CPTemplates : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short WHId { get; set; }
        public short PCId { get; set; }
        public string WHName { get; set; }
        public string PCName { get; set; }
        #endregion

        #region constructor
        public CPTemplates()
        {
        }
        #endregion

        #region internal methods
        internal static List<CPTemplates> Get(string userId)
        {
            List<CPTemplates> lstFC = new List<CPTemplates>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCPTemplates"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            lstFC.Add(new CPTemplates
                            {
                                WHId = Convert.ToInt16(dr["WHId"]),
                                PCId = Convert.ToInt16(dr["PCId"]),
                                WHName = dr["WHName"].ToString(),
                                PCName = dr["PCName"].ToString()
                            });
                        }
                    }
                }
            }
            return lstFC;
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