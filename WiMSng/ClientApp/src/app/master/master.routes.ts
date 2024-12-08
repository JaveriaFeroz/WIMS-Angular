import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { AccessorialChargeComponent } from './accessorialcharge/accessorialcharge.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChargeTypeComponent } from './chargetype/chargetype.component';
import { CostHeadComponent } from './costhead/costhead.component';
import { CPTemplateComponent } from './cptemplate/cptemplate.component';
import { KAMComponent } from './kam/kam.component';
import { ProfitCenterComponent } from './profitcenter/profitcenter.component';
import { StorerGroupComponent } from './storergroup/storergroup.component';
import { SupplierComponent } from './supplier/supplier.component';
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { WHTaxExemptionComponent } from './whtaxexemption/whtaxexemption.component';

export const masterRoutes: Routes = [
  { path: 'Supplier', component: SupplierComponent, canActivate: [AuthGuard], data: { title: 'Supplier Setup' } },
  {
    path: 'AccessorialCharge', component: AccessorialChargeComponent, canActivate: [AuthGuard],
    data: { title: 'Accessorial Charge Setup' }
  },
  {
    path: 'ChargeType', component: ChargeTypeComponent, canActivate: [AuthGuard],
    data: { title: 'Charge Type Setup' }
  },
  {
    path: 'ExpenseType', component: CostHeadComponent, canActivate: [AuthGuard],
    data: { title: 'Expense Type Setup' }
  },
  {
    path: 'KAM', component: KAMComponent, canActivate: [AuthGuard],
    data: { title: 'KAM Setup' }
  },
  {
    path: 'WHTExemption', component: WHTaxExemptionComponent, canActivate: [AuthGuard],
    data: { title: 'WHT Exemption' }
  },
  {
    path: 'CPTemplate', component: CPTemplateComponent, canActivate: [AuthGuard],
    data: { title: 'Cost Provision Template' }
  },
  {
    path: 'StorerGroup', component: StorerGroupComponent, canActivate: [AuthGuard],
    data: { title: 'Storer Group Setup' }
  },
  {
    path: 'Calendar', component: CalendarComponent, canActivate: [AuthGuard],
    data: { title: 'Calendar Setup' }
  },
  {
    path: 'ProfitCenter', component: ProfitCenterComponent, canActivate: [AuthGuard],
    data: { title: 'Profit Center Setup' }
  },
  {
    path: 'UserManagement', component: UserManagementComponent, canActivate: [AuthGuard],
    data: { title: 'User Management' }
  }
]
