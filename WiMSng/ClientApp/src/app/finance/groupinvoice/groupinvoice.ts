import { agFooter } from "../../helper/footer";
import { GroupInvoiceDetail } from "./groupinvoicedetail";

export class GroupInvoice {
    groupInvoiceId: number;
    groupInvoiceNo:number;  
    invoiceDate: Date ; 
    storerGroupId: number;
    pcId: number;
    footer: agFooter;
    details: GroupInvoiceDetail[] = [];
    constructor() { this.footer = new agFooter(); }
}

