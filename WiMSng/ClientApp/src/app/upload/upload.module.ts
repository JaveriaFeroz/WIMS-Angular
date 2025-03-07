import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
import { SharedModule } from '../shared.module';


import { asnComponent } from './asn/asn.component';
import { soComponent } from './so/so.component';
import { uploadRoutes } from './upload.routes';
import { STComponent } from './st/st.component';
import { LocationCategoryComponent } from './LocationCategory/LocationCategory.component';
import { LocationComponent } from './Location/Location.component';
import { StorerComponent } from './Storer/Storer.component';
import { PackkeyComponent } from './Packkey/Packkey.component';
import { SKUComponent } from './SKU/SKU.component';
import { ITRNComponent } from './ITRN/ITRN.component';
import { WHInvoiceComponent } from './WHInvoice/WHInvoice.component';

@NgModule({
  declarations: [
    asnComponent,
    soComponent,
    STComponent,
    LocationCategoryComponent,
    LocationComponent,
    StorerComponent,
    PackkeyComponent,
    SKUComponent,
    ITRNComponent,
    WHInvoiceComponent  
  ],
  imports: [
    RouterModule.forChild(uploadRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [agGridHelper],
})
export class UploadModule { }
