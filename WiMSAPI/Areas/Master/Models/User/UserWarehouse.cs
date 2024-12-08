using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class UserWarehouse : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? UWId { get; set; }
        public short WHId { get; set; }
        public string WHName { get; set; }
        public bool Selected { get; set; } = false;
        public bool Edit { get; set; } = false;
        #endregion

        #region constructors
        public UserWarehouse()
        {
        }
        #endregion

        #region internal methods
        internal static List<UserWarehouse> Get(string userId)
        {
            List<UserWarehouse> warehouses = new List<UserWarehouse>();
            try
            {
                using (DbCommand dbCommandDetail = db.GetStoredProcCommand("GetUserWarehousesById"))
                {
                    db.AddInParameter(dbCommandDetail, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommandDetail))
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                warehouses.Add(new UserWarehouse
                                {
                                    UWId = agHelper.sDBNull(dr["UWId"]),
                                    WHId = Convert.ToInt16(dr["WHId"]),
                                    WHName = dr["WHName"].ToString(),
                                    Selected = Convert.ToBoolean(dr["Selected"])
                                });
                            }
                        }
                    }
                }
                return warehouses;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(string userId, List<UserWarehouse> warehouses, DbTransaction transaction, 
            string updatedBy)
        {
            try
            {
                foreach (UserWarehouse uw in agHelper.GetEdits(warehouses))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveUserWarehouse"))
                    {
                        db.AddInParameter(dbCommand, "UWId", SqlDbType.SmallInt, uw.UWId);
                        db.AddInParameter(dbCommand, "NewUserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, uw.WHId);
                        db.AddInParameter(dbCommand, "Selected", SqlDbType.Bit, uw.Selected);
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