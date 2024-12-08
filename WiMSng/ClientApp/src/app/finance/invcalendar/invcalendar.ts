import { agFooter } from "../../helper/footer";
import { InvCal_Detail } from "./invcal_detail";

export class InvCalendar {
  calendarId: number;
  calendarName: string;
  details: InvCal_Detail[] = [];
  expired: InvCal_Detail[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
