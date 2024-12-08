import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { asn } from './asn';
@Injectable({ providedIn: 'root' })

export class asnService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/asn/GetLookups');
  }

  save(asn: asn[]) {
    return this.http.post<asn[]>(this.apiURL + 'upload/asn/', asn);
  }
}
