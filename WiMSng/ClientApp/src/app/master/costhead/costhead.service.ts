import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CostHead } from './costhead';

@Injectable({ providedIn: 'root' })  
  
export class CostHeadService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getCostHeads(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/CostHead/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/CostHead/GetLookups');
   }

   get(headId: number): Observable<CostHead> {
     return this.http.get<CostHead>(this.apiURL + 'master/CostHead/' + headId);
   }

   save(ch: CostHead) {
     return this.http.post<CostHead>(this.apiURL + 'master/CostHead/', ch);
   } 
}  
