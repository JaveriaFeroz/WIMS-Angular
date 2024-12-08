import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Packkey } from './Packkey';
@Injectable({ providedIn: 'root' })

export class PackkeyService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/Packkey/GetLookups');
  }

  save(Packkey: Packkey[]) {
    return this.http.post<Packkey[]>(this.apiURL + 'upload/Packkey/', Packkey);
  }
}
