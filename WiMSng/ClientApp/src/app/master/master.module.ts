import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
/*import { NumberDirective } from '../helper/numbers-only.directive';*/
import { SharedModule } from '../shared.module';
import { AccessorialChargeComponent } from './accessorialcharge/accessorialcharge.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChargeTypeComponent } from './chargetype/chargetype.component';
import { CostHeadComponent } from './costhead/costhead.component';
import { CPTemplateComponent } from './cptemplate/cptemplate.component';
import { KAMComponent } from './kam/kam.component';
import { masterRoutes } from './master.routes';
import { ProfitCenterComponent } from './profitcenter/profitcenter.component';
import { StorerGroupComponent } from './storergroup/storergroup.component';
import { SupplierComponent } from './supplier/supplier.component';
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { WHTaxExemptionComponent } from './whtaxexemption/whtaxexemption.component';

@NgModule({
  declarations: [ UserManagementComponent,SupplierComponent,
    AccessorialChargeComponent, WHTaxExemptionComponent, CostHeadComponent, ChargeTypeComponent, KAMComponent,
    CPTemplateComponent, StorerGroupComponent, CalendarComponent, ProfitCenterComponent ],
  imports: [
    RouterModule.forChild(masterRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
    //AgGridModule.withComponents([MyDateEditor])
  ],
  providers: [agGridHelper], 
})
export class MasterModule { }
