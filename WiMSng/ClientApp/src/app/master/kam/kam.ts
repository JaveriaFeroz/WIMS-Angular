import { agFooter } from "../../helper/footer";

export class KAM {
    kamId:number;  
    kamName: string;
    email: string; 
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }
}
