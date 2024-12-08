import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { CostProvisionComponent } from './costprovision/costprovision.component';
import { HandlingDocComponent } from './handlingdoc/handlingdoc.component';
import { VariableSqFtComponent } from './variablesqft/variablesqft.component';

export const operationRoutes: Routes = [
  {
    path: 'HandlingDocument', component: HandlingDocComponent, canActivate: [AuthGuard],
    data: { title: ' Handling Document' }
  },
  {
    path: 'CostProvision', component: CostProvisionComponent, canActivate: [AuthGuard],
    data: { title: 'Cost Provisions' }
  },
  {
    path: 'VariableSquareFeet', component: VariableSqFtComponent, canActivate: [AuthGuard],
    data: { title: 'Variable Square Feet' }
  }  
 ]
