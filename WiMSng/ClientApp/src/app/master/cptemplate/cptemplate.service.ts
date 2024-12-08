import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CPTemplate } from './cptemplate';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class CPTemplateService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   //getCPTemplates(): Observable<any[]> {
   //  return this.http.get<any[]>(this.apiURL + 'master/CPTemplate/' );
   //}

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/CPTemplate/GetLookups');
   }

   get(pcId: number): Observable<CPTemplate> {
     return this.http.get<CPTemplate>(this.apiURL + 'master/CPTemplate/' + pcId);
   }

   save(cpt: CPTemplate) {
     return this.http.post<CPTemplate>(this.apiURL + 'master/CPTemplate/', cpt);
   } 
}  
