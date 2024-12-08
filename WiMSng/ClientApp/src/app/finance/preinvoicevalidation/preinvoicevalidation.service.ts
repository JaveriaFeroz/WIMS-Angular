import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PreInvoiceValidationService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookup(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'finance/Invoice/GetLookups');
  }

  get(sgId: number, pcId: number, datefrom: Date, dateto: Date) {
    return this.http.get<any[]>(this.apiURL + 'finance/Invoice/Validate/' + sgId + '/' + pcId + '/' + formatDate(datefrom, 'yyyy-MM-dd', 'en-US') + '/' + formatDate(dateto, 'yyyy-MM-dd', 'en-US') );
  }
}
