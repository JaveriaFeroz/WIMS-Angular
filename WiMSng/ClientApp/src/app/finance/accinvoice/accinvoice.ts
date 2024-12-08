import { agFooter } from "../../helper/footer";
import { AccInvoiceDetail } from "./accinvoicedetail";

export class AccInvoice {
  invoiceId: number;
  invoiceNo: string;
  invoiceDate: Date;
  storerGroupId: number;
  //whId: number;
  pcId: number;
  remarks: string;
  amount: number;
  gstRate: number;

  workFlowId: number;
//  refInvoiceNo: string;
  //refInvoiceDate: string;
  //refPeriodName: string;
  stateId: number;
  stateName: string;
  owner: string;
  completed: boolean;

  submissionComments: number;
  footer: agFooter;
  details: AccInvoiceDetail[] = [];
  //previousDetails: NoteDetail[] = [];
  //revisedDetails: NoteDetail[] = [];
  constructor() { this.footer = new agFooter(); }
}
