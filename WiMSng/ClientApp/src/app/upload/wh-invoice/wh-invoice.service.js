"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhInvoiceService = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let WhInvoiceService = class WhInvoiceService {
    constructor(http) {
        this.http = http;
        // Update this URL to match your API routes
        this.apiUrl = '/Upload/WHInvoice/UploadExcel';
    }
    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.apiUrl, formData).pipe(operators_1.catchError((error) => {
            console.error('Upload error:', error);
            return rxjs_1.throwError(() => { var _a; return new Error(((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'An error occurred during upload'); });
        }));
    }
};
WhInvoiceService = __decorate([
    core_1.Injectable({
        providedIn: 'root',
    })
], WhInvoiceService);
exports.WhInvoiceService = WhInvoiceService;
//# sourceMappingURL=wh-invoice.service.js.map