using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class UserProfile : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string BranchName { get; set; }
        public string DepartmentName { get; set; }
        public string Email { get; set; }
        public string UserLevel { get; set; }
        public bool IsActive { get; set; }
        public List<UserOption> Options { get; set; } = new List<UserOption>();
        public List<UserRole> Roles { get; set; } = new List<UserRole>();
        public List<UserWarehouse> Warehouses { get; set; } = new List<UserWarehouse>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public UserProfile()
        {
        }
        #endregion

        #region internal methods
        internal static UserProfile Get(string userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetUserById"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new UserProfile
                        {
                            UserId = dr["UserId"].ToString(),
                            UserName = dr["UserName"].ToString(),
                            BranchName = dr["BranchName"].ToString(),
                            Email = dr["EmailAddress"].ToString(),
                            DepartmentName = dr["DepartmentName"].ToString(),
                            IsActive = Convert.ToBoolean(dr["UserActive"]),
                            UserLevel = (dr["UserLevel"].ToString()),
                            Footer = new agFooter(dr),
                            Options = UserOption.Get(userId),
                            Warehouses = UserWarehouse.Get(userId),
                            Roles = UserRole.Get(userId)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(UserProfile up, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    #region User Options
                    UserOption.Save(up.UserId, up.Options, transaction, userId);
                    #endregion

                    #region User Role
                    UserRole.Save(up.UserId, up.Roles, transaction, userId);
                    #endregion

                    #region UserWarehouse
                    UserWarehouse.Save(up.UserId, up.Warehouses, transaction, userId);
                    #endregion

                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        internal static string SendPassword(string _userId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("ARS_usp_SendPassword"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                return db.ExecuteScalar(dbCommand).ToString();
            }
        }
        #endregion

        #region dispose method
        public void Dispose()
        {
        }
        #endregion
    }
}