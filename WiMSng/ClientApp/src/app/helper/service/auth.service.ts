import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }
  retainToken(token: string) {
    sessionStorage.setItem("AccessToken", token);
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    sessionStorage.setItem("UserId", decodedToken.sub);
    sessionStorage.setItem("UserName", decodedToken.given_name);
  }

  getToken() {
    return sessionStorage.getItem("AccessToken");
  }

  getUserId() {
    return sessionStorage.getItem("UserId");
  }

  getUserName() {
    return sessionStorage.getItem("UserName");
  }

  getPeriodId() {
    return JSON.parse(sessionStorage.getItem("Period")).periodId;
  }

  getPeriodName() {
    return JSON.parse(sessionStorage.getItem("Period")).periodName;
  }

  getUserRole() {
    sessionStorage.getItem("RoleId");
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  isTokenValid() {
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.getToken());
  }

  logout() {
    sessionStorage.clear();
  }
}
