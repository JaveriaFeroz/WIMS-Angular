"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WF_RateSheet = void 0;
const footer_1 = require("../../helper/footer");
class WF_RateSheet {
    constructor() {
        this.storage = [];
        this.handling = [];
        this.fixedAccessorial = [];
        this.variableAccessorial = [];
        this.projectRemarks = [];
        this.exemptedSL = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.WF_RateSheet = WF_RateSheet;
//# sourceMappingURL=wf_ratesheet.js.map