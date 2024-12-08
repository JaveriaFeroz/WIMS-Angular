import { ControlJobDetail } from "./controljobdetail";

export class ControlJob {
  periodId: number;
  periodName: string;
  details: ControlJobDetail[] = [];
}
