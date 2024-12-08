import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class MyFormService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   ActiveForms(workflowtypeid:number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/MyForms/ActiveForms/' + workflowtypeid);
   }

   CompletedForms(workflowtypeid: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/MyForms/CompletedForms/' + workflowtypeid);
   }

   SentForms(workflowtypeid: number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/MyForms/SentForms/' + workflowtypeid);
   } 
}  
