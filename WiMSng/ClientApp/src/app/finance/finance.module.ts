import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
import { SharedModule } from '../shared.module';
import { AccInvoiceComponent } from './accinvoice/accinvoice.component';
import { ControlJobComponent } from './controljob/controljob.component';
import { financeRoutes } from './finance.routes';
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

@NgModule({
  declarations: [UnInvoiceComponent, PreInvoiceValidationComponent,
    InvoiceRemarksComponent, InvCalendarComponent, GroupInvoiceComponent, FinancialPeriodComponent, ControlJobComponent,
    WF_RateSheetComponent, RateSheetComponent, GenerateInvoiceComponent, AccInvoiceComponent, NoteComponent],
  imports: [
    RouterModule.forChild(financeRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [agGridHelper], 
})
export class FinanceModule { }
