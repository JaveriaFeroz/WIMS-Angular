using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Areas.Common.Models;

namespace WiMSAPI.Helper
{
    class Authentication
    {
        //internal static bool ForceSessionExpired { get; set; }
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region internal methods
        internal static UserCredential AuthenticateUser(string _userId, string _passWord)
        {
            UserCredential _uc = new UserCredential { UserActive = false, AuthStatus = agEnums.AuthenticationStatus.InvalidUserId };
            try
            {
                using (DbCommand dc = db.GetStoredProcCommand("uspAuthenticateUser"))
                {
                    db.AddInParameter(dc, "UserId", SqlDbType.VarChar, _userId);
                    using (DataTable dt = db.ExecuteDataSet(dc).Tables[0])
                    {
                        if (dt.Rows.Count > 0)
                        {
                            DataRow dr = dt.Rows[0];
                            {
                                _uc.UserActive = Convert.ToBoolean(dr["UserActive"]);
                                _uc.ForceSessionExpired = Convert.ToBoolean(dr["ForceSessionExpired"]);
                                _uc.UserId = _userId;
                                if (!Convert.ToBoolean(dr["UserActive"]))
                                    _uc.AuthStatus = agEnums.AuthenticationStatus.UserIdDisabled;
                                else if (_passWord != agHelper.MaskPassword(dr["Password"].ToString(), false))
                                    _uc.AuthStatus = agEnums.AuthenticationStatus.InvalidPassword;
                                else
                                {
                                    if (Convert.ToBoolean(dr["ForcePwdChange"]))
                                    {
                                        _uc.AuthStatus = agEnums.AuthenticationStatus.ForcePasswordChange;
                                    }
                                    else
                                    {
                                        _uc.AuthStatus = agEnums.AuthenticationStatus.Successful;
                                        //bool ret = SaveUserUpdatedSession(_uc.UserId);
                                        //_uc.ForceSessionExpired = false;
                                    }

                                    _uc.UserName = dr["UserName"].ToString();
                                }
                            }
                        }
                        else
                            throw new Exception("The User Id doesn`t exist or has been deactivated!");
                    }
                }
                return _uc;
            }
            catch (Exception)
            { throw; }
        }

        internal static bool UserUpdatedSession(string _userId,string _Pagename)
        {
            try
            {

                using (DbCommand dc = db.GetStoredProcCommand("GetUserUpdatedSession"))
                {
                    db.AddInParameter(dc, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dc, "Pagename", SqlDbType.VarChar, _Pagename);
                    using (DataTable dt = db.ExecuteDataSet(dc).Tables[0])
                    {
                        if (dt.Rows.Count > 0)
                        {
                            DataRow dr = dt.Rows[0];
                            {
                                return Convert.ToBoolean(dr["ForceSessionExpired"]);
                            }
                        }
                        else
                            throw new Exception("The User Id doesn`t exist or has been deactivated!");
                    }
                }
            }
            catch (Exception)
            { throw; }
        }
        internal static bool SaveUserUpdatedSession(string _userId)
        {
            try
            {
                using (DbCommand dc = db.GetStoredProcCommand("SaveUserUpdatedSession"))
                {
                    db.AddInParameter(dc, "UserId", SqlDbType.VarChar, _userId);
                    return true;
                }
            }
            catch (Exception)
            { throw; }
        }
        #endregion
    }
}
