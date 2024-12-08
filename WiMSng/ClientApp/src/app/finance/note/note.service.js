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
exports.NoteService = void 0;
const core_1 = require("@angular/core");
let NoteService = class NoteService {
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
    getRefInvInfo(invoiceNo) {
        return this.http.get(this.apiURL + 'finance/Invoice/GetShortInfo/' + encodeURIComponent(invoiceNo));
    }
    //getDefaultGST(sgId: number, pcId: number, refinvoiceno: string, workFlowId: number): Observable<any> {
    //  return this.http.get<any>(this.apiURL + 'finance/AccInvoice/GetDefaultGST/' + sgId + '/' + pcId + '/' + refinvoiceno + '/' + workFlowId);
    //}
    save(note) {
        return this.http.post(this.apiURL + 'finance/AccInvoice/', note);
    }
    submit(sub) {
        return this.http.post(this.apiURL + 'finance/AccInvoice/Submit/', sub);
    }
};
NoteService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    }),
    __param(1, core_1.Inject('API_BASE_URL'))
], NoteService);
exports.NoteService = NoteService;
//# sourceMappingURL=note.service.js.map