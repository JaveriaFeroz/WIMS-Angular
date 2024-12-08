import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Calendar } from './calendar';

 @Injectable({  
  providedIn: 'root'  
})  
  
export class CalendarService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }
   
   getLookup(): Observable<any> {
     return this.http.get<any>(this.apiURL + 'master/Calendar/GetLookups');
   }

   get(datefrom: Date, dateto: Date): Observable<Calendar>{
     return this.http.get<Calendar>(this.apiURL + 'master/Calendar/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US'));
   }

   save(cal: Calendar) {
     return this.http.post<Calendar>(this.apiURL + 'master/Calendar/', cal);
   } 
}  
