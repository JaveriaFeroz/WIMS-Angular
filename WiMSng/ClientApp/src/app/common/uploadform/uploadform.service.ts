import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 @Injectable({  
  providedIn: 'root'  
})  
  
 export class UploadFormService {
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   get(workflowId:number): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'common/UploadForms/' + workflowId);
   }

}  
