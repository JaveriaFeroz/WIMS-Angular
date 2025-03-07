import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './common/login/login-layout.component';
import { MainLayoutComponent } from './common/main/main-layout.component';
import { MyFormComponent } from './common/myform/myform.component';
import { UploadFormComponent } from './common/uploadform/uploadform.component';
import { PageNotFoundComponent } from './helper/error/page-not-found.component';
import { AuthGuard } from './helper/guard/auth.guard';
import { STComponent } from './upload/st/st.component';
import { LocationCategoryComponent } from './upload/LocationCategory/LocationCategory.component';
import { LocationComponent } from './upload/Location/Location.component';
import { StorerComponent } from './upload/Storer/Storer.component';
import { PackkeyComponent } from './upload/Packkey/Packkey.component';
import { SKUComponent } from './upload/SKU/SKU.component';
import { ITRNComponent } from './upload/ITRN/ITRN.component';
import { asnComponent } from './upload/ASN/asn.component';
import { soComponent } from './upload/SO/so.component';
import { WHInvoiceComponent } from './upload/WHInvoice/WHInvoice.component';

export const mainRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginLayoutComponent, data: { title: 'Login' } },
  { path: 'MainForm', component: MainLayoutComponent, canActivate: [AuthGuard], data: { title: 'Main' } },
  { path: 'common/MyForm', component: MyFormComponent, canActivate: [AuthGuard], data: { title: 'My Forms' } },
  { path: 'common/UploadForm', component: UploadFormComponent, canActivate: [AuthGuard], data: { title: 'Upload Forms' } },
  { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
  { path: 'finance', loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule) },
  { path: 'operation', loadChildren: () => import('./operation/operation.module').then(m => m.OperationModule) },
 // { path: 'upload', loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule) },
  { path: 'ST', component: STComponent, data: { title: 'ST' } },
  { path: 'LocationCategory', component: LocationCategoryComponent, data: { title: 'LocationCategory' } },
  { path: 'Location', component: LocationComponent, data: { title: 'Location' } },
  { path: 'Storer', component: StorerComponent, data: { title: 'Storer' } },
  { path: 'Packkey', component: PackkeyComponent, data: { title: 'Packkey' } },
  { path: 'SKU', component: SKUComponent, data: { title: 'SKU' } },
  { path: 'ITRN', component: ITRNComponent, data: { title: 'ITRN' } },
  { path: 'ASN', component: asnComponent, data: { title: 'ITRN' } },
  { path: 'SO', component: soComponent, data: { title: 'ITRN' } },
  { path: 'WHInvoice', component: WHInvoiceComponent, data: { title: 'Warehouse Invoice' } },
  { path: '**', component: PageNotFoundComponent }
]
