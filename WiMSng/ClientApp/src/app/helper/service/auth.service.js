"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const core_1 = require("@angular/core");
const angular_jwt_1 = require("@auth0/angular-jwt");
let AuthService = class AuthService {
    constructor(myRoute) {
        this.myRoute = myRoute;
    }
    retainToken(token) {
        sessionStorage.setItem("AccessToken", token);
        const helper = new angular_jwt_1.JwtHelperService();
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
        //this.CurrentPeriod = data.periodName;
        //this.CurrentPeriodId = data.periodId;
        //return sessionStorage.getItem("PeriodId");
    }
    getPeriodName() {
        return JSON.parse(sessionStorage.getItem("Period")).periodName;
        //return sessionStorage.getItem("PeriodName");
    }
    getUserRole() {
        sessionStorage.getItem("RoleId");
    }
    isLoggedIn() {
        return this.getToken() !== null;
    }
    isTokenValid() {
        const helper = new angular_jwt_1.JwtHelperService();
        return !helper.isTokenExpired(this.getToken());
    }
    logout() {
        sessionStorage.clear();
    }
};
AuthService = __decorate([
    core_1.Injectable()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map