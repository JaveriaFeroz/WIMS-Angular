import { agFooter } from "../../helper/footer";
import { StorerGroupDetail } from "./storergroupdetail";

export class StorerGroup {
    groupId:number;  
    groupName: string;
    nameOnInvoice: string;
    address: string;
    contactPerson: string;
    contactNo: string;
    faxNo: string;
    email: string;
    creditDays: number;
    ntn:  string;
    strn: string;
    cwClientId: string;
    printWithLetterHead: boolean;
    footer: agFooter;
    details: StorerGroupDetail[] = [];
    constructor() { this.footer = new agFooter(); }
}
