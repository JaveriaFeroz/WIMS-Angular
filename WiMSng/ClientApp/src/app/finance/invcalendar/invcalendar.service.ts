import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvCalendar } from './invcalendar';

@Injectable({ providedIn: 'root' })  

export class InvCalendarService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
  }

   getInvoiceCalendar(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'finance/InvoiceCalendar/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'finance/InvoiceCalendar/GetLookups');
   }

   get(calendarId: number): Observable<InvCalendar> {
     return this.http.get<InvCalendar>(this.apiURL + 'finance/InvoiceCalendar/' + calendarId);
   }

   save(ic: InvCalendar) {
     return this.http.post<InvCalendar>(this.apiURL + 'finance/InvoiceCalendar/', ic);
   } 
}  
