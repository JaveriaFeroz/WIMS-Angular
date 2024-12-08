import { agFooter } from "../../helper/footer";

export class ChargeType {
    typeId:number;  
    typeName: string;
    descOnInvoice: string;
    chargeCode: string; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }   
}
