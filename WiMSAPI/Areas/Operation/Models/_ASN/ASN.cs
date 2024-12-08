using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Common.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Operation.Models
{
    public class ASN : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public string ASNNo { get; set; }
        public string StorerKey { get; set; }
        public short? WHId { get; set; }
        public string CustomerRefNo { get; set; }
        public short? ContainerType1 { get; set; }
        public short? ContainerQty1 { get; set; }
        public short? ContainerType2 { get; set; }
        public short? ContainerQty2 { get; set; }
        public bool Coload { get; set; }
        public Footer AuditTrail { get; set; } = new Footer();
        #endregion

        #region constructor
        public ASN()
        {

        }
        #endregion

        #region internal methods
        internal static ASN Get(short _whId, string _storerKey, string _asnNo, string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetASNByNo"))
                {
                    db.AddInParameter(dbCommand, "WHId", SqlDbType.TinyInt, _whId);
                    db.AddInParameter(dbCommand, "StorerKey", SqlDbType.VarChar, _storerKey);
                    db.AddInParameter(dbCommand, "ASNNo", SqlDbType.VarChar, _asnNo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new ASN
                            {
                                WHId = _whId,
                                StorerKey = _storerKey,
                                ASNNo = _asnNo,
                                Coload = Convert.ToBoolean(dr["Coload"]),
                                CustomerRefNo = dr["CustomerOrderNo"].ToString(),
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

        internal static bool Save(ASN _asn, string _userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveASN"))
                {
                    db.AddInParameter(dbCommand, "ASNNo", SqlDbType.VarChar, _asn.ASNNo);
                    db.AddInParameter(dbCommand, "WarehouseId", SqlDbType.TinyInt, _asn.WHId);
                    db.AddInParameter(dbCommand, "Coload", SqlDbType.Bit, _asn.Coload);
                    db.AddInParameter(dbCommand, "ContainerType", SqlDbType.SmallInt, _asn.ContainerType1);
                    db.AddInParameter(dbCommand, "ContainerQty", SqlDbType.SmallInt, _asn.ContainerQty1);
                    db.AddInParameter(dbCommand, "ContainerType2", SqlDbType.SmallInt, _asn.ContainerType2);
                    db.AddInParameter(dbCommand, "ContainerQty2", SqlDbType.SmallInt, _asn.ContainerQty2);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, _userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, _asn.AuditTrail.UpdatedOn);
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
