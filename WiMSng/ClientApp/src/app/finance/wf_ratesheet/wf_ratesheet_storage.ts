import { WF_RateSheet_Storage_LocCategory } from "./wf_ratesheet_storage_loccategory";

export class WF_RateSheet_Storage {
  wrssId?: number;
  rssId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  suId?: number;
  stId?: number;
  rate?: number; 
  otRate?: number;
  fixedSqFt?: number;
  minVolume?: number;
  minAmount?: number;
  periodTypeId?: number;
  stepCharges: boolean;
  isVisible: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  action: string;
  locationCategory: WF_RateSheet_Storage_LocCategory[] = [];
}
