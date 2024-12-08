import { agFooter } from "../../helper/footer";

export class Supplier {
  supplierId: number;
  supplierName: string;
  controlSupplierId: string;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }

}


