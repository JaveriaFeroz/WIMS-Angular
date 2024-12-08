using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using WiMSAPI.Helper;

namespace WiMSAPI.Areas.Operation.Models
{
    public class SqFtReading : IDisposable
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int? VSFId { get; set; }
        public DateTime? StorageDate { get; set; }
        public decimal SqFt { get; set; }
        public bool OverTime { get; set; }
        //public bool Add { get; set; } = true;
        public bool Edit { get; set; } = false;
        //public bool Delete { get; set; } = false;
        #endregion

        #region constructor
        public SqFtReading()
        {
        }
        #endregion

        #region internal methods
        internal static List<SqFtReading> Get(short storerGroupId, short pcId, DateTime dateFrom, DateTime dateTo, 
            short storageTypeId, string userId)
        {
            try
            {
                List<SqFtReading> readings = new List<SqFtReading>();
                using (DbCommand dbCommand = db.GetStoredProcCommand("GetVariableSqFt"))
                {
                    db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, storerGroupId);
                    db.AddInParameter(dbCommand, "DateFrom", SqlDbType.DateTime, dateFrom);
                    db.AddInParameter(dbCommand, "DateTo", SqlDbType.DateTime, dateTo);
                    db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                    db.AddInParameter(dbCommand, "StorageTypeId", SqlDbType.SmallInt, storageTypeId);
                    db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                    using (DataSet ds = db.ExecuteDataSet(dbCommand))
                    {
                        if (ds != null && ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                readings.Add(new SqFtReading
                                {
                                    VSFId = agHelper.iDBNull(dr["VSFId"]),
                                    StorageDate = Convert.ToDateTime(dr["StorageDate"]),
                                    SqFt = Convert.ToDecimal(dr["SqFt"]),
                                    OverTime = Convert.ToBoolean(dr["OverTime"])//,
                                    //Add = false
                                });
                            }
                        }
                    }
                }
                return readings;
            }
            catch (Exception) { throw; }
        }

        internal static bool Save(short storerGroupId, short pcId, short storageTypeId, 
            List<SqFtReading> details, string userId, DbTransaction transaction)
        {
            try
            {
                foreach (SqFtReading sqf in agHelper.GetEdits(details))
                {
                    using (DbCommand dbCommand = db.GetStoredProcCommand("SaveVariableSqFt"))
                    {
                        db.AddInParameter(dbCommand, "DSFId", SqlDbType.Int, sqf.VSFId);
                        db.AddInParameter(dbCommand, "StorerGroupId", SqlDbType.SmallInt, storerGroupId);
                        db.AddInParameter(dbCommand, "PCId", SqlDbType.SmallInt, pcId);
                        db.AddInParameter(dbCommand, "StorageTypeId", SqlDbType.SmallInt, storageTypeId);
                        db.AddInParameter(dbCommand, "StorageDate", SqlDbType.DateTime, sqf.StorageDate);
                        db.AddInParameter(dbCommand, "SqFt", SqlDbType.Decimal, sqf.SqFt);
                        db.AddInParameter(dbCommand, "OverTime", SqlDbType.Bit, sqf.OverTime);
                        db.AddInParameter(dbCommand, "UserId", SqlDbType.VarChar, userId);
                        //db.AddInParameter(dbCommand, "Action", SqlDbType.Char, (sqf.Delete ? "D" : (sqf.Add ? "I" : "U")));
                        db.ExecuteNonQuery(dbCommand, transaction);
                    }
                }
                return true;
            }
            catch (Exception) { throw; }
        }
        #endregion

        public void Dispose()
        {
        }
    }
}