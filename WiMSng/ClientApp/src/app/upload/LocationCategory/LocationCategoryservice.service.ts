import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LocationCategory } from './LocationCategory';
@Injectable({ providedIn: 'root' })

export class LocationCategoryService {
  apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getLookUp() {
    return this.http.get<any>(this.apiURL + 'upload/LocationCategory/GetLookups');
  }

  save(LocationCategory: LocationCategory[]) {
    return this.http.post<LocationCategory[]>(this.apiURL + 'upload/LocationCategory/', LocationCategory);
  }
}
