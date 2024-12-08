import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HandlingDoc } from './handlingdoc';
 @Injectable({  
  providedIn: 'root'  
})  
  
export class HandlingDocService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getLookUp() {
     return this.http.get<any>(this.apiURL + 'operation/HandlingDoc/GetLookups');
   }

   get(whId: number, storerKey: string, docNo: string, docTypeId: number): Observable<HandlingDoc> {
     return this.http.get<HandlingDoc>(this.apiURL + 'operation/HandlingDoc/' + whId + '/' + storerKey + '/' + docNo + '/' + docTypeId);
   }

   save(hd: HandlingDoc) {
     return this.http.post<HandlingDoc>(this.apiURL + 'operation/HandlingDoc/', hd);
   } 
}  
