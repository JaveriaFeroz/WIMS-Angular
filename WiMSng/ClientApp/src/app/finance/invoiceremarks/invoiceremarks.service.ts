import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceRemarks } from './invoiceremarks';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InvoiceRemarksService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   get(invoiceno: string): Observable<InvoiceRemarks> {
     return this.http.get<InvoiceRemarks>(this.apiURL + 'finance/InvoiceRemarks/' + encodeURIComponent(invoiceno));
   }

   save(ir: InvoiceRemarks) {
     return this.http.post<InvoiceRemarks>(this.apiURL + 'finance/InvoiceRemarks/', ir);
   } 
}  
