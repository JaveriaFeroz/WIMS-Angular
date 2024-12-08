import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { Invoice } from './generateinvoice';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class InvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   validate(storerGroupId: number, pcId: number, dateFrom: Date, dateTo: Date) {
     return this.http.get<any[]>(this.apiURL + 'finance/Invoice/Validate/' + storerGroupId + '/' + pcId + '/' + formatDate(dateFrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateTo, 'yyyy-MM-dd', 'en-US'));
   }

   generate(inv: Invoice) {
     return this.http.post<any>(this.apiURL + 'finance/Invoice/Generate', inv);
   }

   getCalendars(sgId: number, pcId: number, inclPastPeriod: boolean): Observable<Invoice> {
     return this.http.get<Invoice>(this.apiURL + 'finance/Invoice/GetCalendar/' + sgId + '/' + pcId + '/' + inclPastPeriod);
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'finance/Invoice/GetLookups');
   }

   getInvoices(): Observable<Invoice[]> {
     return this.http.get<Invoice[]>(this.apiURL + 'finance/Invoice/GetPending');
    }     

   get(formId: number): Observable<Invoice> {
     return this.http.get<Invoice>(this.apiURL + 'finance/Invoice/' + formId);
   }

   save(inv: Invoice) {
     return this.http.post<any>(this.apiURL + 'finance/Invoice/', inv);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'finance/Invoice/Submit/', sub);
   }
}  
