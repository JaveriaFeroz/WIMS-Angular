import { agFooter } from "../../helper/footer";
import { SqFtReading } from "./sqftreading";

export class VariableSqFt {
  storerGroupId: number;
  pcId: number;
  storageTypeId: number;
  dateFrom?: Date;
  dateTo?; Date;
  footer: agFooter;
  details: SqFtReading[] = [];
  constructor() { this.footer = new agFooter(); }
}
