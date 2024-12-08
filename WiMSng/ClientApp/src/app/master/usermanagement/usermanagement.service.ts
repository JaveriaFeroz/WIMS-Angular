import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from './userprofile';

@Injectable({  
  providedIn: 'root'  
})  
export class UserManagementService {  
   apiURL: string;
  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {
    this.apiURL = baseUrl;
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL + 'master/UserManagement/' );
  }

  get(userid: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiURL + 'master/UserManagement/' + userid);
  }

  save(userprofile: UserProfile) {
    return this.http.post<UserProfile>(this.apiURL + 'master/UserManagement/', userprofile);
  } 
}
