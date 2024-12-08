import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChargeType } from './chargetype';

 @Injectable({ providedIn: 'root' })  
  
 export class ChargeTypeService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getChargeTypes(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/ChargeType/' );
   }

   getLookup(){
     return this.http.get<any>(this.apiURL + 'master/ChargeType/GetLookups');
   }

   get(typeId: number): Observable<ChargeType> {
     return this.http.get<ChargeType>(this.apiURL + 'master/ChargeType/' + typeId);
   }

   save(ct: ChargeType) {
     return this.http.post<ChargeType>(this.apiURL + 'master/ChargeType/', ct);
   } 
}  
