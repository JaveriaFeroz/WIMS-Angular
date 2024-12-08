import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Location } from './Location';
@Injectable({ providedIn: 'root' })

export class LocationService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/Location/GetLookups');
  }

  save(Location: Location[]) {
    return this.http.post<Location[]>(this.apiURL + 'upload/Location/', Location);
  }
}
