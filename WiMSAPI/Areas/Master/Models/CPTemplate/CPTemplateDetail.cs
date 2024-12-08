using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public class CPTemplateDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int DetailId { get; set; }
        public short? SupplierId { get; set; }
        public short? CostHeadId { get; set; }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CPTemplateDetail()
        {
        }
        #endregion

        #region internal methods
        internal static List<CPTemplateDetail> Get(short pcId)
        {
            List<CPTemplateDetail> details = new List<CPTemplateDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCPTemplateByPCId"))
            {
                //db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, whId);
                db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds.Tables != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new CPTemplateDetail
                            {
                                DetailId = Convert.ToInt32(dr["DetailId"]),
                                CostHeadId = Convert.ToInt16(dr["CostHeadId"]),
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static bool Save(short pcId, List<CPTemplateDetail> details,
           string userId, DbTransaction transaction)
        {
            try
            {
                foreach (CPTemplateDetail mtd in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCPTemplate"))
                    {
                        db.AddInParameter(dbCommand, "DetailId", SqlDbType.Int, mtd.DetailId);
                        //db.AddInParameter(dbCommand, "WHId", SqlDbType.SmallInt, whId);
                        db.AddInParameter(dbCommand, "PCId", SqlDbType.VarChar, pcId);
                        db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, mtd.SupplierId);
                        db.AddInParameter(dbCommand, "CostHeadId", SqlDbType.SmallInt, mtd.CostHeadId);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (
                           mtd.Delete ? "D" : (mtd.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception)
            { throw; }
        }
        #endregion

        #region IDisposable implementation
        public void Dispose()
        {
        }
        #endregion
    }
}