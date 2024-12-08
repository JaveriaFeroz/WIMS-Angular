"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateSheet = void 0;
const footer_1 = require("../../helper/footer");
class RateSheet {
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
exports.RateSheet = RateSheet;
//# sourceMappingURL=ratesheet.js.map