import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { WF_RateSheet } from './wf_ratesheet';

@Injectable({ providedIn: 'root' })  
  
export class WFRateSheetService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getRateSheets(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/WF_RateSheet/' );
   }

   get(formId: number): Observable<WF_RateSheet> {
     return this.http.get<WF_RateSheet>(this.apiURL + 'finance/WF_RateSheet/' + formId);
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'finance/WF_RateSheet/GetLookups/');
   }

   getExisting(sgId: number, pcId: number): Observable<WF_RateSheet> {
     return this.http.get<WF_RateSheet>(this.apiURL + 'finance/WF_RateSheet/GetExisting/' + sgId + '/' + pcId);
   }

   save(rs: WF_RateSheet) {
     return this.http.post<any>(this.apiURL + 'finance/WF_RateSheet/', rs);
   }

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'finance/WF_RateSheet/Submit/', sub);
   } 
}
