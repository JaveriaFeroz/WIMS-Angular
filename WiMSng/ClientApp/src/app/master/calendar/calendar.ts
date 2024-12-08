import { agFooter } from "../../helper/footer";
import { CalendarDays } from "./calendardays";

export class Calendar {
  dateFrom?: Date;
  dateTo?: Date;
  details: CalendarDays[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
