import { agFooter } from "../../helper/footer";

export class HandlingDoc {
  docNo: string;
  docTypeId: number;    
  storerKey: string;
  whId :number;  
  customerRefNo: string;
  containerType1?: number;
  qty1?: number;
  containerType2?: number;
  qty2?: number;
  coload:boolean; 
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }   
}
