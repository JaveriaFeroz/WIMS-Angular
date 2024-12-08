using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class UserRole : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? URId { get; set; }
        public short RoleId { get; set; }
        public string RoleName { get; set; }
        public bool Selected { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructor
        public UserRole()
        {

        }
        #endregion

        #region internal methods
        internal static List<UserRole> Get(string userId)
        {
            List<UserRole> roles = new List<UserRole>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserRolesbyId"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                roles.Add(new UserRole
                                {
                                    URId = agHelper.sDBNull(dr["URId"]),
                                    RoleId = Convert.ToInt16(dr["RoleId"]),
                                    RoleName = dr["RoleName"].ToString(),
                                    Selected = Convert.ToBoolean(dr["Selected"])
                                });
                            }
                        }
                    }
                }
                return roles;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string userId, List<UserRole> roles, DbTransaction transaction, string updatedBy)
        {
            try
            {
                foreach (UserRole ur in agHelper.GetEdits(roles))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveUserRole"))
                    {
                        db.AddInParameter(dbCommand, "URId", SqlDbType.Int, ur.URId);
                        db.AddInParameter(dbCommand, "NewUserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "RoleId", SqlDbType.SmallInt, ur.RoleId);
                        db.AddInParameter(dbCommand, "Selected", SqlDbType.Bit, ur.Selected);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, updatedBy);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region dispose method
        public void Dispose()
        {
        }
        #endregion
    }
}