import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ST } from './st';
@Injectable({ providedIn: 'root' })

export class STService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/ST/GetLookups');
  }

  save(st: ST[]) {
    return this.http.post<ST[]>(this.apiURL + 'upload/ST/', st);
  }
}
