using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Master.Models
{
    public  class CPTemplate : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        //public short? WHId { get; set; }
        public short? PCId { get; set; }
        public List<CPTemplateDetail> Details { get; set; } = new List<CPTemplateDetail>();
        public agFooter Footer { get; set; } = new agFooter();
        #endregion

        #region constructor
        public CPTemplate()
        {
        }
        #endregion

        #region internal methods
        internal static CPTemplate Get(short pcId)
        {
            return new CPTemplate
            {
              //  WHId = whId,
                PCId = pcId,
                Details = CPTemplateDetail.Get(pcId)
            };
        }

        internal static bool Save(CPTemplate template, string userId)
        {
            using (DbConnection dbconnection = db.CreateConnection())
            {
                dbconnection.Open();
                DbTransaction transaction = dbconnection.BeginTransaction();
                try
                {
                    CPTemplateDetail.Save(template.PCId.Value, template.Details, userId, transaction);
                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }

        }
        #endregion

        #region IDisposable Members
        public void Dispose()
        {

        }
        #endregion
    }
}