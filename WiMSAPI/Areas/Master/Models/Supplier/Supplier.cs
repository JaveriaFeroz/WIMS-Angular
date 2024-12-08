using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class Supplier: IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? SupplierId { get; set; } 
        public string SupplierName { get; set; }
        public bool IsActive { get; set; }
        public string ControlSupplierId { get; set; }
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public Supplier()
        {
        }
        #endregion

        #region internal methods
        internal static Supplier Get(short supplierId)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetSupplierById"))
            {
                db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, supplierId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        using (Supplier supp = new Supplier())
                        {
                            DataRow dr = ds.Tables[0].Rows[0];
                            supp.SupplierId = supplierId;
                            supp.SupplierName = dr["SupplierName"].ToString();
                            supp.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            supp.ControlSupplierId = dr["ControlSupplierId"].ToString();
                            supp.Footer = new agFooter(dr);
                            return supp;
                        }
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(Supplier s, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveSupplier"))
                {
                    db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, s.SupplierId);
                    db.AddInParameter(dbCommand, "SupplierName", SqlDbType.VarChar, s.SupplierName);                   
                    db.AddInParameter(dbCommand, "IsActive", SqlDbType.Bit, s.IsActive);
                    db.AddInParameter(dbCommand, "ControlSupplierId", SqlDbType.VarChar, s.ControlSupplierId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "UpdatedOn", SqlDbType.DateTime, s.Footer.UpdatedOn);
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
            // no implementation
        }
        #endregion
    }
}