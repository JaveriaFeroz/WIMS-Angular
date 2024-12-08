using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class ChargeType : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? TypeId { get; set; }
        public string TypeName { get; set; }
        public string DescOnInvoice { get; set; }     
        public string ChargeCode { get; set; }
        public agFooter Footer { get; set; } = new agFooter();        
        #endregion

        #region constructor
        public ChargeType()
        {
        }
        #endregion

        #region internal methods
        internal static ChargeType Get(short id)
        {
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetChargeTypeById"))
            {
                db.AddInParameter(dbCommand, "ChargeTypeId", SqlDbType.SmallInt, id);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        return new ChargeType
                        {
                            TypeId = id,
                            TypeName = dr["ChargeTypeName"].ToString(),
                            DescOnInvoice = dr["NameOnInvoice"].ToString(),
                            ChargeCode = dr["ChargeCode"].ToString(),
                            Footer = new agFooter(dr)
                        };
                    }
                    else
                        return null;
                }
            }
        }

        internal static bool Save(ChargeType ct, string userId)
        {
            try
            {
                using (DbCommand dbCommand = db.GetStoredProcCommand("SaveChargeType"))
                {
                    db.AddInParameter(dbCommand, "ChargeTypeId", SqlDbType.TinyInt, ct.TypeId);
                    db.AddInParameter(dbCommand, "ChargeTypeName", SqlDbType.VarChar, ct.TypeName);
                    db.AddInParameter(dbCommand, "NameOnInvoice", SqlDbType.VarChar, ct.DescOnInvoice);
                    db.AddInParameter(dbCommand, "ChargeCode", SqlDbType.VarChar, ct.ChargeCode);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    db.AddInParameter(dbCommand, "updatedon", SqlDbType.DateTime, ct.Footer.UpdatedOn);                    
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