using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public partial class UserAccess
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short OptionId { get; set; }
        public string OptionName { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        #endregion

        #region constructors
        public UserAccess()
        {

        }
        #endregion

        #region internal methods
        internal static List<UserAccess> Get(string userId)
        {
            List<UserAccess> useraccess = new List<UserAccess>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetAccessForUser"))
            {
                db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                using DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0];
                if (dt != null)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        useraccess.Add(new UserAccess
                        {
                            OptionId = Convert.ToInt16(dr["OptionId"]),
                            OptionName = dr["OptionName"].ToString(),
                            CanAdd = Convert.ToBoolean(dr["CanAdd"]),
                            CanEdit = Convert.ToBoolean(dr["CanEdit"]),
                            CanDelete = Convert.ToBoolean(dr["CanDelete"])
                        });
                    }
                }
            }
            return useraccess;
        }
        #endregion
    }
}