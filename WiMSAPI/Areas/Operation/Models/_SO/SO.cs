using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Operation.Models
{
    public class SO : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string OrderNo { get; set; }
        public string StorerKey { get; set; }
        public short? WHId { get; set; }
        public string CustomerOrderNo { get; set; }
        public short? ContainerType1 { get; set; }
        public short? ContainerQty1 { get; set; }
        public short? ContainerType2 { get; set; }
        public short? ContainerQty2 { get; set; }
        public bool Coload { get; set; }
        public Footer AuditTrail { get; set; } = new Footer();
        #endregion

        #region constructor
        public SO()
        {
            
        }
        #endregion

        #region internal methods
        internal static SO Get(short _whId, string _storerKey, string _orderNo, string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetSOByNo"))
                {
                    db.AddInParameter(dbCommand, "WarehouseId", SqlDbType.SmallInt, _whId);
                    db.AddInParameter(dbCommand, "StorerKey", SqlDbType.VarChar, _storerKey);
                    db.AddInParameter(dbCommand, "OrderNo", SqlDbType.VarChar, _orderNo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new SO
                            {
                                WHId = _whId,
                                StorerKey = _storerKey,
                                OrderNo = _orderNo,
                                Coload = Convert.ToBoolean(dr["Coload"]),
                                CustomerOrderNo = dr["CustomerOrderNo"].ToString(),
                                ContainerType1 = agHelper.DBNullInt16(dr["ContainerType"]),
                                ContainerQty1 = agHelper.DBNullInt16(dr["ContainerQty"]),
                                ContainerType2 = agHelper.DBNullInt16(dr["ContainerType2"]),
                                ContainerQty2 = agHelper.DBNullInt16(dr["ContainerQty2"]),
                                AuditTrail = new Footer(dr)
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(SO _so, string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSO"))
                {
                    db.AddInParameter(dbCommand, "OrderNo", SqlDbType.VarChar, _so.OrderNo);
                    db.AddInParameter(dbCommand, "WHId", SqlDbType.TinyInt, _so.WHId);
                    db.AddInParameter(dbCommand, "Coload", SqlDbType.Bit, _so.Coload);
                    db.AddInParameter(dbCommand, "ContainerType", SqlDbType.SmallInt, _so.ContainerType1);
                    db.AddInParameter(dbCommand, "ContainerQty", SqlDbType.SmallInt, _so.ContainerQty1);
                    db.AddInParameter(dbCommand, "ContainerType2", SqlDbType.SmallInt, _so.ContainerType2);
                    db.AddInParameter(dbCommand, "ContainerQty2", SqlDbType.SmallInt, _so.ContainerQty2);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _so.AuditTrail.UpdatedOn);
                    db.ExecuteNonQuery(dbCommand);
                    return true;
                }
            }
            catch (Exception) { throw; }
        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}