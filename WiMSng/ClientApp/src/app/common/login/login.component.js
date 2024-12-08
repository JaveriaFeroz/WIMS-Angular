"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginComponent = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let LoginComponent = class LoginComponent {
    constructor(router, svcLogin, auth, svcToaster, svcWaitDlg) {
        this.router = router;
        this.svcLogin = svcLogin;
        this.auth = auth;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.model = { UserId: null, UserName: null, Password: null };
        this.UserAccess = {};
    }
    ngAfterViewInit() { }
    ngOnInit() {
        sessionStorage.clear();
    }
    login() {
        if (this.model.UserId && this.model.Password) {
            localStorage.setItem("UserId", JSON.stringify(this.model.UserId));
            localStorage.setItem("Password", JSON.stringify(this.model.Password));
            this.svcWaitDlg.open({});
            this.svcLogin.authenticate(this.model).subscribe(data => {
                switch (data.message) {
                    case "Successful":
                        this.auth.retainToken(data.accessToken);
                        this.getUserMenuAndAccess().then(() => this.router.navigate(['/MainForm']));
                        break;
                    case "InvalidUserId":
                        this.svcToaster.showFailure('The user id you have entered is invalid');
                        break;
                    case "UserIdDisabled":
                        this.svcToaster.showFailure('The user id you have entered has been disabled. Please contact your System Admin for further details');
                        break;
                    case "InvalidPassword":
                        this.svcToaster.showFailure('The Password you have entered is invalid');
                        break;
                    case "ForcePasswordChange":
                        this.router.navigate(['/ChangePassword']);
                        break;
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        else {
            this.svcToaster.showWarning('Please enter valid User Id & Password before proceeding with Login process!');
        }
    }
    ;
    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/MainForm']);
    }
    async getUserMenuAndAccess() {
        return new Promise((resolve, reject) => {
            try {
                let userAccess = this.svcLogin.getAccess();
                let userMenu = this.svcLogin.getMenu();
                let userRole = this.svcLogin.getUserRole();
                let period = this.svcLogin.getPeriod();
                rxjs_1.forkJoin([userAccess, userMenu, userRole, period]).subscribe(results => {
                    sessionStorage.setItem("UserAccess", JSON.stringify(results[0]));
                    sessionStorage.setItem("UserMenu", JSON.stringify(results[1]));
                    sessionStorage.setItem("RoleId", JSON.stringify(results[2]));
                    sessionStorage.setItem("Period", JSON.stringify(results[3]));
                    resolve(true);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
};
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map