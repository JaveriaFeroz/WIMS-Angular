import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UserOption } from '../menu/useroption';
import { Menu } from '../menu/menu';
import { Login } from './login';

@Injectable()
export class LoginService {  
  listUserOption: UserOption[];
  apiURL: string;

  constructor(private http: HttpClient, @Inject('API_BASE_URL') baseUrl: string) {   
    this.apiURL = baseUrl;
  } 

  authenticate(model: Login) {
    try {
      return this.http.post<any>(this.apiURL + 'common/token', model);
    }
    catch (exception) { alert(exception); }
  }

  getAccess() {
    return this.http.get<UserOption[]>(this.apiURL + 'master/user/GetAccess');
  }

  getMenu() {
    return this.http.get<Menu[]>(this.apiURL + 'master/user/GetMenu');
  }

  getUserRole() {
    return this.http.get<any>(this.apiURL + 'master/user/GetUserRole');
  }

  getPeriod() {
    return this.http.get<any>(this.apiURL + 'finance/Period');
  }
}
