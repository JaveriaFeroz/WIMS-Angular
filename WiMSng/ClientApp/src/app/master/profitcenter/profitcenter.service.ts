import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfitCenter } from './profitcenter';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class ProfitCenterService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getProfitCenters(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/ProfitCenter/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/ProfitCenter/GetLookups');
   }

   get(pcId: number): Observable<ProfitCenter> {
     return this.http.get<ProfitCenter>(this.apiURL + 'master/ProfitCenter/' + pcId);
   }

   save(pc: ProfitCenter) {
     return this.http.post<ProfitCenter>(this.apiURL + 'master/ProfitCenter/', pc);
   } 
}  
