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
    public class Users : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string BranchName { get; set; }
        public string DepartmentName { get; set; }
        #endregion

        #region constructor
        public Users()
        {
        }
        #endregion

        #region internal methods
        internal static List<Users> Get(bool activeOnly = false)
        {
            try
            {
                List<Users> users = new List<Users>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetUsers"))
                {
                    db.AddInParameter(dbCommand, "ActiveOnly", SqlDbType.Bit, activeOnly);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                users.Add(new Users
                                {
                                    UserId = dr["UserId"].ToString(),
                                    UserName = dr["UserName"].ToString(),
                                    BranchName = dr["BranchName"].ToString(),
                                    DepartmentName = dr["DepartmentName"].ToString()
                                });
                            }
                        }
                    }
                }
                return users;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Implementation
        public void Dispose()
        {
        }
        #endregion
    }
}