using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace WiMSAPI.Areas.Master.Models
{
    public class Suppliers : IDisposable
     {
         #region private properties
         private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
         #endregion

         #region public properties
         public short? SupplierId { get; set; }
         public string SupplierName { get; set; }
         public string ControlId { get; set; }
         #endregion

         #region constructor
         public Suppliers()
         {

         }
         #endregion

         #region public method
         public static List<Suppliers> Get(bool activeOnly = true)
         {
             List<Suppliers> suppliers = new List<Suppliers>();
             using (DbCommand dbCommand = db.GetStoredProcCommand("GetSuppliers"))
             {
                 db.AddInParameter(dbCommand, "activeonly", SqlDbType.Bit, activeOnly);
                 using (DataTable dt = db.ExecuteDataSet(dbCommand).Tables[0])
                 {
                     if (dt != null)
                     {
                         foreach (DataRow dr in dt.Rows)
                         {
                            suppliers.Add(new Suppliers
                            {
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                SupplierName = dr["SupplierName"].ToString(),
                                ControlId = dr["ControlSupplierId"].ToString()
                            });
                         }
                     }
                 }
             }
             return suppliers;
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