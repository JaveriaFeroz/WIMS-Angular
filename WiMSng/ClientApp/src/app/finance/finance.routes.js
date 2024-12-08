"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const accinvoice_component_1 = require("./accinvoice/accinvoice.component");
const controljob_component_1 = require("./controljob/controljob.component");
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
exports.financeRoutes = [
    {
        path: 'PreInvoiceValidation', component: preinvoicevalidation_component_1.PreInvoiceValidationComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Pre Invoice Validation' }
    },
    {
        path: 'InvoiceRemarks', component: invoiceremarks_component_1.InvoiceRemarksComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Invoice Remarks Setup' }
    },
    {
        path: 'InvoiceCalendar', component: invcalendar_component_1.InvCalendarComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Invoice Calendar Setup' }
    },
    {
        path: 'FinancialPeriod', component: financialperiod_component_1.FinancialPeriodComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Financial Period' }
    },
    {
        path: 'ControlJob', component: controljob_component_1.ControlJobComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Control Job Setup' }
    },
    {
        path: 'UnInvoice', component: uninvoice_component_1.UnInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Un Invoice' }
    },
    {
        path: 'WFRateSheet', component: wf_ratesheet_component_1.WF_RateSheetComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'WF Rate Setup' }
    },
    {
        path: 'RateSheet', component: ratesheet_component_1.RateSheetComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Rate Sheet' }
    },
    {
        path: 'GenerateInvoice', component: generateinvoice_component_1.GenerateInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Generate Invoice' }
    },
    {
        path: 'GroupInvoice', component: groupinvoice_component_1.GroupInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Group Invoice' }
    },
    {
        path: 'AccVariableInvoice', component: accinvoice_component_1.AccInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Variable Accessorial Invoice', workFlowId: 2 }
    },
    {
        path: 'AccFixedInvoice', component: accinvoice_component_1.AccInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Fixed Accessorial Invoice', workFlowId: 3 }
    },
    {
        path: 'AdhocInvoice', component: accinvoice_component_1.AccInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Ad hoc Invoice', workFlowId: 4 }
    },
    {
        path: 'DebitNote', component: note_component_1.NoteComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Debit Note', workFlowId: 5 }
    },
    {
        path: 'CreditNote', component: note_component_1.NoteComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Credit Note', workFlowId: 6 }
    }
];
//# sourceMappingURL=finance.routes.js.map