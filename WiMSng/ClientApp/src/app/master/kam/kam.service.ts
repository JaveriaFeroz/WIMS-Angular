import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KAM } from './kam';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class KAMService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getKAMs(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/KAM/' );
   }


   get(id: number): Observable<KAM> {
     return this.http.get<KAM>(this.apiURL + 'master/KAM/' + id);
   }

   save(kam: KAM) {
     return this.http.post<KAM>(this.apiURL + 'master/KAM/', kam);
   } 
}  
