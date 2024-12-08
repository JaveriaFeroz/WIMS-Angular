"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccInvoiceService = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
let AccInvoiceService = class AccInvoiceService {
    constructor(http, baseUrl) {
        this.http = http;
        this.apiURL = baseUrl;
    }
    getInvoices(workFlowId) {
        return this.http.get(this.apiURL + 'finance/AccInvoice/' + workFlowId);
    }
    getLookup() {
        return this.http.get(this.apiURL + 'finance/AccInvoice/GetLookups');
    }
    get(invoiceNo, workFlowId) {
        return this.http.get(this.apiURL + 'finance/AccInvoice/' + encodeURIComponent(invoiceNo) + '/' + workFlowId);
    }
    getFixed(sgId, pcId, transactiondate) {
        return this.http.get(this.apiURL + 'finance/AccInvoice/GetFixed/' + sgId + '/' + pcId + '/' + common_1.formatDate(transactiondate, 'yyyy-MM-dd', 'en-US'));
    }
    getVariable(sgId, pcId, transactiondate) {
        return this.http.get(this.apiURL + 'finance/AccInvoice/GetVariable/' + sgId + '/' + pcId + '/' + common_1.formatDate(transactiondate, 'yyyy-MM-dd', 'en-US'));
    }
    getDefaultGST(sgId, pcId, workFlowId) {
        return this.http.get(this.apiURL + 'finance/AccInvoice/GetDefaultGST/' + sgId + '/' + pcId + '/' + workFlowId);
    }
    save(ai) {
        return this.http.post(this.apiURL + 'finance/AccInvoice/', ai);
    }
    submit(sub) {
        return this.http.post(this.apiURL + 'finance/AccInvoice/Submit/', sub);
    }
};
AccInvoiceService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], AccInvoiceService);
exports.AccInvoiceService = AccInvoiceService;
//# sourceMappingURL=accinvoice.service.js.map