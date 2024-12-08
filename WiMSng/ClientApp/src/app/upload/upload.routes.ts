////import { Routes } from '@angular/router';
import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { asnComponent } from './asn/asn.component';
import { soComponent } from './so/so.component';

export const uploadRoutes: Routes = [
  { path: 'ASN', component: asnComponent, canActivate: [AuthGuard], data: { title: 'ASN' } },
  { path: 'SO', component: soComponent, canActivate: [AuthGuard], data: { title: 'SO' } }
 ]
