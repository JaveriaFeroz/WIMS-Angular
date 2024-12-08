import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { InvoiceInfo } from './invoiceinfo';
import { Note } from './note';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class NoteService {  
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

   get(invoiceNo: string, workFlowId: number): Observable<Note> {
     return this.http.get<Note>(this.apiURL + 'finance/AccInvoice/' + encodeURIComponent(invoiceNo) + '/' + workFlowId);
   }

   getRefInvInfo(invoiceNo: string): Observable<InvoiceInfo> {
     return this.http.get<InvoiceInfo>(this.apiURL + 'finance/Invoice/GetShortInfo/' + encodeURIComponent(invoiceNo));
   }

   save(note: Note) {
     return this.http.post<any>(this.apiURL + 'finance/AccInvoice/', note);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'finance/AccInvoice/Submit/', sub);
   }  
}  
