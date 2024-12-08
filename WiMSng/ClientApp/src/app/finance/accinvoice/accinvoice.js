"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccInvoice = void 0;
const footer_1 = require("../../helper/footer");
class AccInvoice {
    //previousDetails: NoteDetail[] = [];
    //revisedDetails: NoteDetail[] = [];
    constructor() {
        this.details = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.AccInvoice = AccInvoice;
//# sourceMappingURL=accinvoice.js.map