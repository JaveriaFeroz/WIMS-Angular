import { agFooter } from "../../helper/footer";
import { RateSheet_Accessorial } from "./ratesheet_accessorial";
import { RateSheet_Handling } from "./ratesheet_handling";
import { RateSheet_ProjectRemarks } from "./ratesheet_projectremarks";
import { RateSheet_Storage } from "./ratesheet_storage";
import { RateSheet_Storage_ExLoc } from "./ratesheet_storage_exloc";

export class RateSheet {
  rateSheetId?: number;
  storerGroupName: string;  
  pcName: string;
  kamName: string;
  calendarName: string;
  minInvAmount: number;
  expiryDate?: Date;
  isActive: boolean;
  storage: RateSheet_Storage[] = [];
  handling: RateSheet_Handling[] = [];
  fixedAccessorial: RateSheet_Accessorial[] = [];
  variableAccessorial: RateSheet_Accessorial[] = [];
  projectRemarks: RateSheet_ProjectRemarks[] = [];
  exemptedSL: RateSheet_Storage_ExLoc[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
