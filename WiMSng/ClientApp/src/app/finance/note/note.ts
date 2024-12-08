import { agFooter } from "../../helper/footer";
import { NoteDetail } from "../note/notedetail";

export class Note {
  invoiceId: number;
  invoiceNo: string;
  invoiceDate: Date;
  storerGroupId: number;
  pcId: number;
  remarks: string;
  amount: number;
  gstRate: number;

  workFlowId: number;
  refInvoiceNo: string;
  refInvoiceDate: string;
  refPeriodName: string;
  stateId: number;
  stateName: string;
  owner: string;
  completed: boolean;

  storerGroupName: string;
  pcName: string;

  submissionComments: number;
  footer: agFooter;
  previousDetails: NoteDetail[] = [];
  revisedDetails: NoteDetail[] = [];
  constructor() { this.footer = new agFooter(); }
}
