import { WF_RateSheet_Handling_ContainerType } from "./wf_ratesheet_handling_containertype";
import { WF_RateSheet_Handling_SKU } from "./wf_ratesheet_handling_sku";

export class WF_RateSheet_Handling {
  rshId?: number;
  wrshId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  htId?: number;
  huId?: number;
  rate?: number;
  sundayRate?: number;
  holidayRate?: number;
  minVolume: number;
  minAmount: number;
  looseUnitId: number;
  looseRate: number;
  uniquePalletCount: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  action: string;
  containerRates: WF_RateSheet_Handling_ContainerType[] = [];
  skUs: WF_RateSheet_Handling_SKU[] = [];
}


   
