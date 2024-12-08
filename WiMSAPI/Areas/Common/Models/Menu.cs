using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Common.Models
{
    public class Menu : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short MenuId { get; set; }
        public string MenuName { get; set; }
        public short? ParentId { get; set; }
        public string SubGroup { get; set; }
        public short? SortOrder { get; set; }
        public string Route { get; set; }
        public short? WorkFlowId { get; set; }
        #endregion

        #region constructor
        public Menu()
        {
        }
        #endregion

        #region internal methods
        internal static List<Menu> Get(string userId)
        {
            try
            {
                List<Menu> lstMenu = new List<Menu>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetMenuByUserId"))
                {
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0];
                    if (dt != null)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            lstMenu.Add(new Menu
                            {
                                MenuId = Convert.ToInt16(dr["OptionId"]),
                                MenuName = dr["OptionName"].ToString(),
                                ParentId = agHelper.sDBNull(dr["ParentOptionId"]),
                                SubGroup = dr["SubGroup"].ToString(),
                                SortOrder = agHelper.sDBNull(dr["SortOrder"]),
                                Route = dr["Route"] == DBNull.Value ? null : dr["Route"].ToString(),
                                WorkFlowId = agHelper.sDBNull(dr["workflowId"])
                            });
                        }
                    }
                }
                return lstMenu;
            }
            catch (Exception) { throw; }
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