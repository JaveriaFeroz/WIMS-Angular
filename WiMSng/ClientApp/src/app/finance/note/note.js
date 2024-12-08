"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const footer_1 = require("../../helper/footer");
class Note {
    constructor() {
        this.previousDetails = [];
        this.revisedDetails = [];
        this.footer = new footer_1.agFooter();
    }
}
exports.Note = Note;
//# sourceMappingURL=note.js.map