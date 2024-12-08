"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
const shared_module_1 = require("../shared.module");
const accinvoice_component_1 = require("./accinvoice/accinvoice.component");
const controljob_component_1 = require("./controljob/controljob.component");
const finance_routes_1 = require("./finance.routes");
const financialperiod_component_1 = require("./financialperiod/financialperiod.component");
const generateinvoice_component_1 = require("./generateinvoice/generateinvoice.component");
const groupinvoice_component_1 = require("./groupinvoice/groupinvoice.component");
const invcalendar_component_1 = require("./invcalendar/invcalendar.component");
const invoiceremarks_component_1 = require("./invoiceremarks/invoiceremarks.component");
const note_component_1 = require("./note/note.component");
const preinvoicevalidation_component_1 = require("./preinvoicevalidation/preinvoicevalidation.component");
const ratesheet_component_1 = require("./ratesheet/ratesheet.component");
const uninvoice_component_1 = require("./uninvoice/uninvoice.component");
const wf_ratesheet_component_1 = require("./wf_ratesheet/wf_ratesheet.component");
let FinanceModule = class FinanceModule {
};
FinanceModule = __decorate([
    core_1.NgModule({
        declarations: [uninvoice_component_1.UnInvoiceComponent, preinvoicevalidation_component_1.PreInvoiceValidationComponent,
            invoiceremarks_component_1.InvoiceRemarksComponent, invcalendar_component_1.InvCalendarComponent, groupinvoice_component_1.GroupInvoiceComponent, financialperiod_component_1.FinancialPeriodComponent, controljob_component_1.ControlJobComponent,
            wf_ratesheet_component_1.WF_RateSheetComponent, ratesheet_component_1.RateSheetComponent, generateinvoice_component_1.GenerateInvoiceComponent, accinvoice_component_1.AccInvoiceComponent, note_component_1.NoteComponent],
        imports: [
            router_1.RouterModule.forChild(finance_routes_1.financeRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], FinanceModule);
exports.FinanceModule = FinanceModule;
//# sourceMappingURL=finance.module.js.map