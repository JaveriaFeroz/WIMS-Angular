import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Recipient } from './recipient';

 @Injectable({ providedIn: 'root' })  
  
export class RecipientService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getHistory(workFlowId: number, formId: number) {
     return this.http.get<any>(this.apiURL + 'common/Recipient/GetHistory/' + workFlowId + '/' +  formId);
   }

   getCreator(workFlowId: number, formId: number) {
     return this.http.get<any>(this.apiURL + 'common/Recipient/GetCreator/' + workFlowId + '/' + formId);
   }

   getCPRecipients(provisionId: number, stateId: number) {
     return this.http.get<any>(this.apiURL + 'common/Recipient/GetCPRecipients/' + provisionId + '/' + stateId);
   }

   //getDNRecipients(invoiceId: number, stateId: number) {
   //  return this.http.get<any>(this.apiURL + 'common/Recipient/GetDNRecipients/' + invoiceId + '/' + stateId);
   //}

   getRateSheetRecipients(formId: number, stateId: number) {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetWFRateSheetRecipients/' + formId+'/' + stateId);
   }

   getAccInvoiceRecipients(formId: number, workFlowId: number, stateId: number) {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetAccInvoiceRecipients/' + formId + '/' + workFlowId + '/' + stateId);
   }

   getInvoiceRecipients(formId: number, stateId: number) {
     return this.http.get<any[]>(this.apiURL + 'common/Recipient/GetInvoiceRecipients/' + formId + '/' + stateId);
   }
}
