import { agFooter } from "../../helper/footer";

export class Invoice {
  formId: number;
  storerGroupId: number;
  //whId: number;
  pcId: number;
  //pcName: string;
  inclLastPeriod: boolean;
  dateFrom: Date;
  dateTo: Date;
  calendarId: number;
  calendarName: string;
  gstRate: number;
  stateId: number;
  stateName: string;
  owner: string;
  completed: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
