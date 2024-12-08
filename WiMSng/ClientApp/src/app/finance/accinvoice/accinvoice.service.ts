import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { AccInvoice } from './accinvoice';
import { AccInvoiceDetail } from './accinvoicedetail';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class AccInvoiceService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getInvoices(workFlowId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/AccInvoice/' + workFlowId);
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'finance/AccInvoice/GetLookups');
   }

   get(invoiceNo: string, workFlowId: number): Observable<AccInvoice> {
     return this.http.get<AccInvoice>(this.apiURL + 'finance/AccInvoice/' + encodeURIComponent(invoiceNo) + '/' + workFlowId);
   }

   getFixed(sgId: number, pcId: number, transactiondate: Date): Observable<AccInvoiceDetail[]> {
     return this.http.get<AccInvoiceDetail[]>(this.apiURL + 'finance/AccInvoice/GetFixed/' + sgId + '/' + pcId + '/' + formatDate(transactiondate, 'yyyy-MM-dd', 'en-US') );
   }

   getVariable(sgId: number, pcId: number, transactiondate: Date ): Observable<AccInvoiceDetail[]> {
     return this.http.get<AccInvoiceDetail[]>(this.apiURL + 'finance/AccInvoice/GetVariable/' + sgId + '/' + pcId + '/' + formatDate(transactiondate, 'yyyy-MM-dd', 'en-US') );
   }

   getDefaultGST(sgId: number, pcId: number, workFlowId: number): Observable<any> {
     return this.http.get<any>(this.apiURL + 'finance/AccInvoice/GetDefaultGST/' + sgId + '/' + pcId + '/' + workFlowId);
   }

   save(ai: AccInvoice) {
     return this.http.post<any>(this.apiURL + 'finance/AccInvoice/', ai);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'finance/AccInvoice/Submit/', sub);
   }
}  
