using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;
using WiMSAPI.Areas.Master.Models;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Operation.Models
{
    [DataContract]
    public class CostProvisionDetail : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int CPDId { get; set; }
        public short? CostHeadId { get; set; }
        public short? SupplierId { get; set; }
        public string Description { get; set; }
        public short? PeriodId { get; set; }
        public decimal GrossAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal NetAmount { get { return GrossAmount + TaxAmount; } set {; } }
        public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public CostProvisionDetail()
        {
            
        }
        #endregion

        #region internal methods
        internal static List<CostProvisionDetail> Get(int provisionId)
        {
            List<CostProvisionDetail> details = new List<CostProvisionDetail>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetCostProvisionDetailById"))
            {
                db.AddInParameter(dbCommand, "ProvisionId", SqlDbType.SmallInt, provisionId);
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            details.Add(new CostProvisionDetail
                            {
                                CPDId = Convert.ToInt32(dr["CPDId"]),
                                CostHeadId = Convert.ToInt16(dr["CostHeadId"]),
                                SupplierId = Convert.ToInt16(dr["SupplierId"]),
                                Description = dr["Description"].ToString(),
                                PeriodId = Convert.ToInt16(dr["PeriodId"]),
                                GrossAmount = Convert.ToDecimal(dr["GrossAmount"]),
                                TaxAmount = Convert.ToDecimal(dr["TaxAmount"]),
                                Add = false
                            });
                        }
                    }
                }
            }
            return details;
        }

        internal static List<CostProvisionDetail> GetFromTemplate(short pcId)
        {
            List<CostProvisionDetail> details = new List<CostProvisionDetail>();
            foreach (CPTemplateDetail cpt in CPTemplateDetail.Get(pcId))
            {
                details.Add(new CostProvisionDetail
                {
                    SupplierId = cpt.SupplierId.Value,
                    CostHeadId = cpt.CostHeadId.Value
                });
            }
            return details;
        }

        internal static bool Save(int provisionId, List<CostProvisionDetail> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (CostProvisionDetail cpd in agHelper.GetChanges(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveCostProvision_Detail"))
                    {
                        db.AddInParameter(dbCommand, "ProvisionId", SqlDbType.Int, provisionId);
                        db.AddInParameter(dbCommand, "CPDId", SqlDbType.Int, cpd.CPDId);
                        db.AddInParameter(dbCommand, "CostHeadId", SqlDbType.SmallInt, cpd.CostHeadId);
                        db.AddInParameter(dbCommand, "SupplierId", SqlDbType.SmallInt, cpd.SupplierId);
                        db.AddInParameter(dbCommand, "Description", SqlDbType.VarChar, cpd.Description);
                        db.AddInParameter(dbCommand, "PeriodId", SqlDbType.SmallInt, cpd.PeriodId);
                        db.AddInParameter(dbCommand, "GrossAmount", DbType.Decimal, cpd.GrossAmount);
                        db.AddInParameter(dbCommand, "TaxAmount", DbType.Decimal, cpd.TaxAmount);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (cpd.Delete ? "D" : (cpd.Add ? "I" : "U")));
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