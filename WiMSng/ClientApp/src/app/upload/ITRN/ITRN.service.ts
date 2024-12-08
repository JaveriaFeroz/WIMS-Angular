import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ITRN } from './ITRN';
@Injectable({ providedIn: 'root' })

export class ITRNService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/ITRN/GetLookups');
  }

  save(ITRN: ITRN[]) {
    return this.http.post<ITRN[]>(this.apiURL + 'upload/ITRN/', ITRN);
  }
}
