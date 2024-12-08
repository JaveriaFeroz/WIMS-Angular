import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { so } from './so';
@Injectable({ providedIn: 'root' })

export class soService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/so/GetLookups');
  }

  save(so: so[]) {
    return this.http.post<so[]>(this.apiURL + 'upload/so/', so);
  }
}
