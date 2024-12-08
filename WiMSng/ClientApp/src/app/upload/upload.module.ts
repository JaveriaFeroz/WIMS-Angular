import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
/*import { NumberDirective } from '../helper/numbers-only.directive';*/
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

@NgModule({
  declarations: [asnComponent, soComponent, STComponent, LocationCategoryComponent, LocationComponent, StorerComponent, PackkeyComponent, SKUComponent, ITRNComponent],
  imports: [
    RouterModule.forChild(uploadRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
    //AgGridModule.withComponents([MyDateEditor])
  ],
  providers: [agGridHelper], 
})
export class UploadModule { }
