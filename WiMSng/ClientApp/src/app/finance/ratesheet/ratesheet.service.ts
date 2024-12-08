import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RateSheet } from './ratesheet';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class RateSheetService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }
   getRateSheets(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/RateSheet/' );
   }

   get(rsId: number): Observable<RateSheet> {
     return this.http.get<RateSheet>(this.apiURL + 'finance/RateSheet/' + rsId);
   }
}  
