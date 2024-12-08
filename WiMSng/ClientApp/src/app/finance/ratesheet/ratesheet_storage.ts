import { RateSheet_Storage_LocCategory } from "./ratesheet_storage_loccategory";

export class RateSheet_Storage {
  rssId?: number;
  dateFrom: string;
  dateTo: string;
  suName: string;
  stName: string;
  rate: number; 
  otRate: number;
  fixedSqFt: number;
  minVolume: number;
  minAmount: number;
  periodTypeName: string;
  stepCharges: boolean;
  isVisible: boolean;
  locationCategory: RateSheet_Storage_LocCategory[] = [];
}
