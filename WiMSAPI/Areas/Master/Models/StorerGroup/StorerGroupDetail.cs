using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class StorerGroupDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? SGDId { get; set; }
        public string StorerKey { get; set; }
        public bool Add { get; set; } = false;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public StorerGroupDetail()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<StorerGroupDetail> Get(short groupId)
        {
            List<StorerGroupDetail> details = new List<StorerGroupDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetStorersByGroupId"))
            {
                db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, groupId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new StorerGroupDetail
                            {
                                SGDId = Convert.ToInt32(dr["SGDId"]),
                                StorerKey = dr["StorerKey"].ToString(),
                                Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(short groupId, List<StorerGroupDetail> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (StorerGroupDetail sgd in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveStorerGroup_Detail"))
                    {
                        db.AddInParameter(dbCommand, "StorerGroupID", SqlDbType.Int, groupId);
                        db.AddInParameter(dbCommand, "SGDId", SqlDbType.Int, sgd.SGDId);
                        db.AddInParameter(dbCommand, "StorerKey", SqlDbType.VarChar, sgd.StorerKey);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "action", SqlDbType.Char, (sgd.Delete ? "D" : (sgd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
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