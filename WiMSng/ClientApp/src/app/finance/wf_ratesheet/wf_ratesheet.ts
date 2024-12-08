import { agFooter } from "../../helper/footer";
import { WF_RateSheet_Accessorial } from "./wf_ratesheet_accessorial";
import { WF_RateSheet_Handling } from "./wf_ratesheet_handling";
import { WF_RateSheet_ProjectRemarks } from "./wf_ratesheet_projectremarks";
import { WF_RateSheet_Storage } from "./wf_ratesheet_storage";
import { WF_RateSheet_Storage_ExLoc } from "./wf_ratesheet_storage_exloc";

export class WF_RateSheet {
  formId?: number;
  //rateSheetId?: number;
  storerGroupId: number;
  //whId?: number;
  pcId?: number;
  kamId?: number;
  calendarId?: number;
  minInvAmount: number;
  expiryDate?: Date;
  isActive: boolean;
  storage: WF_RateSheet_Storage[] = [];
  handling: WF_RateSheet_Handling[] = [];
  fixedAccessorial: WF_RateSheet_Accessorial[] = [];
  variableAccessorial: WF_RateSheet_Accessorial[] = [];
  projectRemarks: WF_RateSheet_ProjectRemarks[] = [];
  exemptedSL: WF_RateSheet_Storage_ExLoc[] = [];
  stateId: number;
  stateName: string;
  owner: string;
  //approved: boolean;
  //rejected: boolean;
  completed: boolean;
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
