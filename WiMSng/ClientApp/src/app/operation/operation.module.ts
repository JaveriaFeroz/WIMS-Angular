import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
import { SharedModule } from '../shared.module';
import { CostProvisionComponent } from './costprovision/costprovision.component';
import { HandlingDocComponent } from './handlingdoc/handlingdoc.component';
import { operationRoutes } from './operation.routes';
import { VariableSqFtComponent } from './variablesqft/variablesqft.component';
@NgModule({
  declarations: [HandlingDocComponent, CostProvisionComponent, VariableSqFtComponent],
  imports: [
    RouterModule.forChild(operationRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [agGridHelper], 
})
export class OperationModule { }
