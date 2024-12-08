import { agFooter } from "../../helper/footer";

export class CostHead {
    headId:number;  
    headName: string;
    chargeCode: string; 
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }   
}
