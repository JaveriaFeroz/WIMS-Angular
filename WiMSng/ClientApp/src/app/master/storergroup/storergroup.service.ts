import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorerGroup } from './storergroup';

@Injectable({ providedIn: 'root' })  
  
export class StorerGroupService {  
   apiURL: string;
   constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
     this.apiURL = baseUrl;
   }

   getStorerGroups(): Observable<any[]> {
     return this.http.get<any[]>(this.apiURL + 'master/StorerGroup/' );
   }

   getLookup() {
     return this.http.get<any>(this.apiURL + 'master/StorerGroup/GetLookups');
   }

   get(sgId: number): Observable<StorerGroup> {
     return this.http.get<StorerGroup>(this.apiURL + 'master/StorerGroup/' + sgId);
   }

   save(sg: StorerGroup) {
     return this.http.post<StorerGroup>(this.apiURL + 'master/StorerGroup/', sg);
   } 
}
