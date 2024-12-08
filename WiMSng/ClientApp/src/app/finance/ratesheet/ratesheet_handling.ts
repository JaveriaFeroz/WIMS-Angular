import { RateSheet_Handling_ContainerType } from "./ratesheet_handling_containerType";
import { RateSheet_Handling_SKU } from "./ratesheet_handling_sku";

export class RateSheet_Handling {
  rshId?: number;
  dateFrom: string;
  dateTo: string;
  htName: string;
  huName: string;
  rate: number;
  sundayRate: number;
  holidayRate: number;
  minVolume: number;
  minAmount: number;
  looseUnitName: string;
  looseRate: number;
  uniquePalletCount: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  containerRate: RateSheet_Handling_ContainerType[] = [];
  skus: RateSheet_Handling_SKU[] = [];
} 
