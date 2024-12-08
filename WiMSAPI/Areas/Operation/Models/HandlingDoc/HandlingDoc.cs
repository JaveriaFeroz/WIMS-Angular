using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Operation.Models
{
    public class HandlingDoc : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        //WHId is kept instead of PCId in handling document because this data is coming from WMS Infor where we only have warehouse
        #region public properties
        public short? DocTypeId { get; set; }
        public string DocNo { get; set; }
        public string StorerKey { get; set; }
        public short? WHId { get; set; }
        public string CustomerRefNo { get; set; }
        public short? ContainerType1 { get; set; }
        public short? Qty1 { get; set; }
        public short? ContainerType2 { get; set; }
        public short? Qty2 { get; set; }
        public bool Coload { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public HandlingDoc()
        {
        }
        #endregion

        #region internal methods
        internal static HandlingDoc Get(short whId, string storerKey, string docNo, short docTypeId, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetHandlingDoc"))
                {
                    db.AddInParameter(dbCommand, "WHId", SqlDbType.TinyInt, whId);
                    db.AddInParameter(dbCommand, "StorerKey", SqlDbType.VarChar, storerKey);
                    db.AddInParameter(dbCommand, "DocTypeId", SqlDbType.TinyInt, docTypeId);
                    db.AddInParameter(dbCommand, "DocNo", SqlDbType.VarChar, docNo);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables[0].Rows.Count > 0)
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            return new HandlingDoc
                            {
                                WHId = whId,
                                StorerKey = storerKey,
                                DocNo = docNo,
                                DocTypeId = docTypeId,
                                Coload = Convert.ToBoolean(dr["Coload"]),
                                CustomerRefNo = dr["CustomerOrderNo"].ToString(),
                                ContainerType1 = agHelper.sDBNull(dr["ContainerType"]),
                                Qty1 = agHelper.sDBNull(dr["ContainerQty"]),
                                ContainerType2 = agHelper.sDBNull(dr["ContainerType2"]),
                                Qty2 = agHelper.sDBNull(dr["ContainerQty2"]),
                                Footer = new agFooter(null, dr["CreatedOn"], dr["UpdatedBy"].ToString(), dr["UpdatedOn"])
                            };
                        }
                        else
                            return null;
                    }
                }
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(HandlingDoc doc, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveHandlingDoc"))
                {
                    db.AddInParameter(dbCommand, "DocNo", SqlDbType.VarChar, doc.DocNo);
                    db.AddInParameter(dbCommand, "WarehouseId", SqlDbType.TinyInt, doc.WHId);
                    db.AddInParameter(dbCommand, "Coload", SqlDbType.Bit, doc.Coload);
                    db.AddInParameter(dbCommand, "DocTypeId", SqlDbType.TinyInt, doc.DocTypeId);
                    db.AddInParameter(dbCommand, "ContainerTypeId", SqlDbType.SmallInt, doc.ContainerType1);
                    db.AddInParameter(dbCommand, "ContainerQty", SqlDbType.SmallInt, doc.Qty1);
                    db.AddInParameter(dbCommand, "ContainerTypeId2", SqlDbType.SmallInt, doc.ContainerType2);
                    db.AddInParameter(dbCommand, "ContainerQty2", SqlDbType.SmallInt, doc.Qty2);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, doc.Footer.UpdatedOn);
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
