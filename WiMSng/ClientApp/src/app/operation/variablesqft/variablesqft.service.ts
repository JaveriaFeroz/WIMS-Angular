import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VariableSqFt } from './variablesqft';

 @Injectable({ providedIn: 'root' })  
  
export class VariableSqFtService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }   

   getLookup() {
     return this.http.get<any>(this.apiURL + 'operation/VariableSqFt/GetLookups');
   }

   get(datefrom: Date, dateto: Date, storerGroupId: number, pcId: number, storageTypeId: number): Observable<VariableSqFt> {
     return this.http.get<VariableSqFt>(this.apiURL + 'operation/VariableSqFt/' + storerGroupId + '/' + pcId + '/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US')  + '/' + storageTypeId );
   }

   save(vsf: VariableSqFt) {
     return this.http.post<VariableSqFt>(this.apiURL + 'operation/VariableSqFt/', vsf);
   } 
}  
