"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgilityEnum = void 0;
const core_1 = require("@angular/core");
let AgilityEnum = class AgilityEnum {
    constructor() {
        this.FinanceDepartment = 92;
        this.ContainerHandling = 54;
        this.HandlingBySKU = 56;
        this.FixedSqFt = 1;
        this.VariableSqFt = 2;
        this.PalletSpots = 11;
    }
    static getCPState(stateId) {
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
    static getRateState(stateId) {
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
    static getInvoiceState(stateId) {
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
    InvoiceType(WorkflowName) {
        if (WorkflowName == 'Fixed Accessorial') {
            return 3;
        }
        else if (WorkflowName == 'Variable Accessorial') {
            return 2;
        }
        else if (WorkflowName == 'Ad Hoc Invoice') {
            return 4;
        }
    }
    format(strText) {
        strText = this.padLeft(strText, "0", 10);
        return strText;
    }
    padLeft(text, padChar, size) {
        return (String(padChar).repeat(size) + text).substr(size * -1, size).toString();
    }
};
AgilityEnum = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], AgilityEnum);
exports.AgilityEnum = AgilityEnum;
(function (AgilityEnum) {
    let WorkFlow;
    (function (WorkFlow) {
        WorkFlow[WorkFlow["ALL"] = 0] = "ALL";
        WorkFlow[WorkFlow["Invoice"] = 1] = "Invoice";
        WorkFlow[WorkFlow["FixedAccessorial"] = 2] = "FixedAccessorial";
        WorkFlow[WorkFlow["VariableAccessorial"] = 3] = "VariableAccessorial";
        WorkFlow[WorkFlow["AdHocInvoice"] = 4] = "AdHocInvoice";
        WorkFlow[WorkFlow["DebitNote"] = 5] = "DebitNote";
        WorkFlow[WorkFlow["CreditNote"] = 6] = "CreditNote";
        WorkFlow[WorkFlow["GroupInvoice"] = 7] = "GroupInvoice";
        WorkFlow[WorkFlow["CostProvision"] = 8] = "CostProvision";
        WorkFlow[WorkFlow["WFRateSetup"] = 9] = "WFRateSetup";
    })(WorkFlow = AgilityEnum.WorkFlow || (AgilityEnum.WorkFlow = {}));
})(AgilityEnum = exports.AgilityEnum || (exports.AgilityEnum = {}));
exports.AgilityEnum = AgilityEnum;
//# sourceMappingURL=AgilityEnum.js.map