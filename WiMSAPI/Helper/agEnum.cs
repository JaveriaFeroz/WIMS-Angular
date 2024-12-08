using System.ComponentModel;

namespace WiMSAPI.Helper
{
    public class agEnums
    {
        public const string myFormPath = "../Common/MyForms";
        public const string mainMenuPath = "../Common/Common";
        public const string FinanceDepartment = "92";
        public const short ContainerHandling = 54;
        public const short HandlingBySKU = 56;
        public const short FixedSqFt = 1;
        public const short VariableSqFt = 2;
        public const short PalletSpots = 11;
        //public enum formMode : short { Add = 1, Edit = 2, Recall = 3, ReadOnly = 4, Initialize = 5, Review = 6, };

        //public enum ListItemState : short { UnChanged = 0, Added = 1, Edited = 2, Deleted = 3, };

        public enum AuthenticationStatus : short { Successful = 1, InvalidUserId = 2, InvalidPassword = 3, ForcePasswordChange = 4, UserIdDisabled = 5, }

        //public enum FormsList : short { Current = 0, Processed = 1, Completed = 2, };
        //public enum CalledForm : short { GroupForm = 1, MyForm = 2, Menu = 3 };

        public enum StorageUnit
        {
            FixedSqFt = 1,
            VariableSqFt = 2,
        }

        public enum WorkFlow
        {
            CoreInvoice = 1,
            AccessorialVariable = 2,
            AccessorialFixed = 3,
            AdhocInvoice = 4,
            DebitNote = 5,
            CreditNote = 6,
            GroupInvoice=7,
            CostProvision=8,
            RateSheet=9
        }

        public enum MECPState
        {
            New = 0,
            Saved = 1,
            SubmittedtoFM = 2,
            ReturnedbyFM = 3,
            SubmittedtoFinance = 4,
            ReturnedbyFinance = 5,
            Accepted = 6,
            Submitted = 98,
            Returned = 99,
        }

        public enum DNState
        {
            New = 0,
            Saved = 1,
            SubmittedtoFM = 2,
            ReturnedbyFM = 3,
            SubmittedtoFinance = 4,
            ReturnedbyFinance = 5,
            Accepted = 6,
            SubmittedtoLM = 7,
            ReturnedbyLM = 8,
            Submitted = 98,
            Returned = 99,
        }

        public enum HandlingDocumentType
        {
            ASN = 0,
            ShipmentOrder = 1,
        }

        public enum RequestType
        {
            Approved = 1,
            Returned = 2,
            Rejected = 3,
        }
    }
}

