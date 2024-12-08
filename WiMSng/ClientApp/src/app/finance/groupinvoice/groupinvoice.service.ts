import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupInvoice } from './groupinvoice';
import { GroupInvoiceDetail } from './groupinvoicedetail';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class GroupInvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getGroupInvoices(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/GroupInvoice/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'finance/GroupInvoice/GetLookups');
   }

   get(groupInvoiceNo: number): Observable<GroupInvoice> {
     return this.http.get<GroupInvoice>(this.apiURL + 'finance/GroupInvoice/' + groupInvoiceNo);
   }

   load(sgId: number, pcId:number): Observable<GroupInvoiceDetail[]> {
     return this.http.get<GroupInvoiceDetail[]>(this.apiURL + 'finance/GroupInvoice/GetInvoicesForGrouping/' + sgId + '/' + pcId);
   }

   save(groupinvoice: GroupInvoice) {
     return this.http.post<GroupInvoice>(this.apiURL + 'finance/GroupInvoice/', groupinvoice);
   } 
}
