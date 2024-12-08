import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Storer } from './Storer';
@Injectable({ providedIn: 'root' })

export class StorerService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/Storer/GetLookups');
  }

  save(Storer: Storer[]) {
    return this.http.post<Storer[]>(this.apiURL + 'upload/Storer/', Storer);
  }
}
