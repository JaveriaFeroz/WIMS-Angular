import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submission } from '../../helper/submission';
import { CostProvision } from './costprovision';

 @Injectable({ providedIn: 'root' })  
  
export class CostProvisionService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getCostProvisions(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/CostProvision/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'operation/CostProvision/GetLookups');
   }

   get(provisionId: number): Observable<CostProvision> {
     return this.http.get<CostProvision>(this.apiURL + 'operation/CostProvision/' + provisionId);
   }

   save(cp: CostProvision) {
     return this.http.post<any>(this.apiURL + 'operation/CostProvision/', cp);
   }

   load(pcId: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'operation/CostProvision/GetFromTemplate/' + pcId);
   }  

   submit(sub: Submission) {
     return this.http.post<any>(this.apiURL + 'operation/CostProvision/Submit', sub);
   }
}
