import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { AccInvoiceComponent } from './accinvoice/accinvoice.component';
import { ControlJobComponent } from './controljob/controljob.component';
import { FinancialPeriodComponent } from './financialperiod/financialperiod.component';
import { GenerateInvoiceComponent } from './generateinvoice/generateinvoice.component';
import { GroupInvoiceComponent } from './groupinvoice/groupinvoice.component';
import { InvCalendarComponent } from './invcalendar/invcalendar.component';
import { InvoiceRemarksComponent } from './invoiceremarks/invoiceremarks.component';
import { NoteComponent } from './note/note.component';
import { PreInvoiceValidationComponent } from './preinvoicevalidation/preinvoicevalidation.component';
import { RateSheetComponent } from './ratesheet/ratesheet.component';
import { UnInvoiceComponent } from './uninvoice/uninvoice.component';
import { WF_RateSheetComponent } from './wf_ratesheet/wf_ratesheet.component';

export const financeRoutes: Routes = [
  {
    path: 'PreInvoiceValidation', component: PreInvoiceValidationComponent, canActivate: [AuthGuard],
    data: { title: 'Pre Invoice Validation' }
  },
  {
    path: 'InvoiceRemarks', component: InvoiceRemarksComponent, canActivate: [AuthGuard],
    data: { title: 'Invoice Remarks Setup' }
  },
  {
    path: 'InvoiceCalendar', component: InvCalendarComponent, canActivate: [AuthGuard],
    data: { title: 'Invoice Calendar Setup' }
  },
  {
    path: 'FinancialPeriod', component: FinancialPeriodComponent, canActivate: [AuthGuard],
    data: { title: 'Financial Period' }
  },
  {
    path: 'ControlJob', component: ControlJobComponent, canActivate: [AuthGuard],
    data: { title: 'Control Job Setup' }
  },
  {
    path: 'UnInvoice', component: UnInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Un Invoice' }
  },
  {
    path: 'WFRateSheet', component: WF_RateSheetComponent, canActivate: [AuthGuard],
    data: { title: 'WF Rate Setup' }
  },
  {
    path: 'RateSheet', component: RateSheetComponent, canActivate: [AuthGuard],
    data: { title: 'Rate Sheet' }
  },
  {
    path: 'GenerateInvoice', component: GenerateInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Generate Invoice' }
  },
  {
    path: 'GroupInvoice', component: GroupInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Group Invoice' }
  },
  {
    path: 'AccVariableInvoice', component: AccInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Variable Accessorial Invoice', workFlowId: 2 }
  },
  {
    path: 'AccFixedInvoice', component: AccInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Fixed Accessorial Invoice', workFlowId: 3 }
  }, 
  {
    path: 'AdhocInvoice', component: AccInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Ad hoc Invoice', workFlowId: 4 }
  },
  {
    path: 'DebitNote', component: NoteComponent, canActivate: [AuthGuard],
    data: { title: 'Debit Note', workFlowId: 5 }
  },
  {
    path: 'CreditNote', component: NoteComponent, canActivate: [AuthGuard],
    data: { title: 'Credit Note', workFlowId: 6 }
  }
 ]
