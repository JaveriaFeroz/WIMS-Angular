import { agFooter } from "../../helper/footer";
import { CostProvisionDetail } from "./costprovisiondetail";

export class CostProvision {
  provisionId: number;
  whId: number
  pcId: number;
  periodId: number;
  periodName: number;
  owner: string;
  stateId: number
  stateName: string;
  completed: boolean;
  submissionComments: number;
  footer: agFooter;
  details: CostProvisionDetail[] = [];
  constructor() { this.footer = new agFooter(); }
}
