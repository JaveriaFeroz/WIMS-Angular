using System;
using System.Data;

namespace WiMSAPI.Helper
{
    public class agFooter
    {
        #region public properties
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        #endregion

        #region constructor
        public agFooter()
        {

        }

        public agFooter(string _createdBy, object _createdOn, string _updatedBy = null, object _updatedOn = null)
        {
            CreatedBy = _createdBy;
            if (_createdOn != DBNull.Value)
                CreatedOn = Convert.ToDateTime(_createdOn);
            UpdatedBy = _updatedBy;
            if (_updatedOn != DBNull.Value)
                UpdatedOn = Convert.ToDateTime(_updatedOn);
        }

        public agFooter(DataRow dr)
        {
            CreatedBy = dr["CreatedBy"].ToString();
            CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
            UpdatedBy = dr["UpdatedBy"].ToString();
            if (dr["UpdatedOn"] != DBNull.Value)
                UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
        }
        #endregion
    }
}
