using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;

namespace WiMSAPI.Areas.Common.Models
{
    public class UForms
    {
        #region private properties
        private static readonly SqlDatabase db = DatabaseFactory.CreateDatabase() as SqlDatabase;
        #endregion

        #region public properties
        public int FormId { get; set; }
        public string WHName { get; set; }
        public string StorerKey { get; set; }
        public string CustomerOrderNo { get; set; }
        public short WorkFlowId { get; set; }
        public string WorkFlowName { get; set; }
        public string StateName { get; set; }
        public string Sender { get; set; }       
        public string SentOn { get; set; }
        public string UploadedinWMSDbOn { get; set; }
        #endregion

        #region constructor
        public UForms()
        {
        }

        public UForms(int formId, string stateName, string sender, string sentOn, string uploadedinWMSDbOn,
              short workFlowId, string workFlowName, string whName, string customerOrderNo, string storerKey)
        {
            FormId = formId;
            StateName = stateName;
            Sender = sender;
            SentOn = sentOn;
            UploadedinWMSDbOn = uploadedinWMSDbOn;
            WorkFlowId = workFlowId;
            WorkFlowName = workFlowName;
            WHName = whName;
            CustomerOrderNo = customerOrderNo;
            StorerKey = storerKey;
        }
        #endregion
    }
}