using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Runtime.Serialization;

namespace WiMSAPI.Areas.Master.Models
{
    [DataContract]
    public class LocCategories : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public short? CategoryId { get; set; }
        public string CategoryName { get; set; }
        #endregion

        #region constructor
        public LocCategories()
        {
        }
        #endregion

        #region internal methods
        internal static List<LocCategories> Get()
        {
            List<LocCategories> categories = new List<LocCategories>();
            using (DbCommand dbCommand = db.GetStoredProcCommand("GetLocCategories"))
            {
                using (DataSet ds = db.ExecuteDataSet(dbCommand))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            categories.Add(new LocCategories
                            {
                                CategoryId = Convert.ToInt16(dr["CategoryId"]),
                                CategoryName = dr["CategoryName"].ToString()
                            });
                        }
                    }
                }
            }
            return categories;
        }
        #endregion

        public void Dispose()
        {
        }
    }
}