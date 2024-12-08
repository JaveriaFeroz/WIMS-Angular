using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class UserOption : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short OptionId { get; set; }
        public string OptionName { get; set; }
        public bool AllowView { get; set; }
        public bool AllowAdd { get; set; }
        public bool AllowEdit { get; set; }
        public bool Edit { get; set; } = false;
        #endregion

        #region constructors
        public UserOption()
        {

        }
        #endregion

        #region intenral methods
        internal static List<UserOption> Get(string pUserId)
        {
            List<UserOption> options = new List<UserOption>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserOptionsById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, pUserId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                options.Add(new UserOption
                                {
                                    OptionId = Convert.ToInt16(dr["OptionId"]),
                                    OptionName = dr["OptionName"].ToString(),
                                    AllowView = Convert.ToBoolean(dr["IsVisible"]),
                                    AllowAdd = Convert.ToBoolean(dr["CanAdd"]),
                                    AllowEdit = Convert.ToBoolean(dr["CanEdit"])
                                });
                            }
                        }
                    }
                }
                return options;
            }
            catch (Exception) { throw;}
        }

        internal static bool Save(string userId, List<UserOption> options, DbTransaction transaction, string updatedBy)
        {
            try
            {
                foreach (UserOption uo in agHelper.GetEdits(options))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveUserOption"))
                    {
                        db.AddInParameter(dbCommand, "NewUserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "OptionId", SqlDbType.SmallInt, uo.OptionId);
                        db.AddInParameter(dbCommand, "AllowAccess", SqlDbType.Bit, uo.AllowView);
                        db.AddInParameter(dbCommand, "AllowAdd", SqlDbType.Bit, uo.AllowAdd);
                        db.AddInParameter(dbCommand, "AllowEdit", SqlDbType.Bit, uo.AllowEdit);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, updatedBy);
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Member
        public void Dispose()
        {
        }
        #endregion
    }
}