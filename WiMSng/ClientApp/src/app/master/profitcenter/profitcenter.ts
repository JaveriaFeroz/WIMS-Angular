import { agFooter } from "../../helper/footer";

export class ProfitCenter {
  pcId?: number;
  pcCode: string;
  pcName: string;
  deptCode: string;
  whId?: number;
  isActive: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
