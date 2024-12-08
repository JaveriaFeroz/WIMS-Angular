import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SKU } from './SKU';
@Injectable({ providedIn: 'root' })

export class SKUService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/SKU/GetLookups');
  }

  save(SKU: SKU[]) {
    return this.http.post<SKU[]>(this.apiURL + 'upload/SKU/', SKU);
  }
}
