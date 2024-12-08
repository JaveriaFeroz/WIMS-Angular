import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class agEnum {
  constructor() { }
  public readonly FinanceDepartment: number = 92;

  static getCPState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted for Approval";
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 5:
        return "Return";
      case 99:
        return "Cancelled";
    }
  }

  static getRateState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted for Approval";
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 5:
        return "Return";
      case 99:
        return "Cancelled";
    }
  }

  static getInvoiceState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted for Approval";
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 5:
        return "Return";
      case 99:
        return "Cancelled";
    }
  }

    //InvoiceType(WorkflowName: string) {
    //  if (WorkflowName == 'Fixed Accessorial') {
    //    return 3;
    //  }
    //  else if (WorkflowName == 'Variable Accessorial') {
    //    return 2;
    //  }
    //  else if (WorkflowName == 'Ad Hoc Invoice') {
    //    return 4;
    //  }
    //}
        
  format(strText: string) {
    strText = this.padLeft(strText, "0", 10);
    return strText;
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size).toString();
  }
}

export namespace agEnum {
  export enum WorkFlow {
    ALL = 0, Invoice = 1, FixedAccessorial = 2, VariableAccessorial = 3, AdHocInvoice = 4,
    DebitNote = 5, CreditNote = 6, GroupInvoice = 7, CostProvision = 8,
    WFRateSetup = 9
  }

  export enum ChargeUnit {
    FixedSqFt = 1, VariableSqFt = 2, PalletSpots = 11, ContainerHandling = 54, HandlingBySKU = 56
  }
}
