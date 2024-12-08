import { agFooter } from "../../helper/footer";
import { CPTemplateDetail } from "./cptemplatedetail";

export class CPTemplate {
  //whId: number;
  pcId: number;
  footer: agFooter;
  details: CPTemplateDetail[] = [];
  constructor() { this.footer = new agFooter(); }
}
