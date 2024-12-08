import { agFooter } from "../../helper/footer";

export class InvoiceRemarks {
  invoiceId: number;
  invoiceNo: string;
  projectName: string;
  projectTitle: string;
  remarks: string;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
