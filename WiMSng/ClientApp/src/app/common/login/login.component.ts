import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Login } from './login';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements AfterViewInit {
  model: Login = { UserId: null, UserName: null, Password: null };
  errorMessage: string;
  UserAccess: any = {};
  ngAfterViewInit() { }
  constructor(private router: Router, private svcLogin: LoginService, private auth: AuthService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
  }

  ngOnInit() {
    sessionStorage.clear();
  }

  login() {
    if (this.model.UserId && this.model.Password) {
      localStorage.setItem("UserId", JSON.stringify(this.model.UserId));
      localStorage.setItem("Password", JSON.stringify(this.model.Password));
      this.svcWaitDlg.open({});
      this.svcLogin.authenticate(this.model).subscribe(
        data => {
          switch (data.message) {
            case "Successful":
              this.auth.retainToken(data.accessToken)
              this.getUserMenuAndAccess().then(() =>
                this.router.navigate(['/MainForm'])
              );
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
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    else {
      this.svcToaster.showWarning('Please enter valid User Id & Password before proceeding with Login process!');
    }
  };

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
        forkJoin([userAccess, userMenu, userRole, period]).subscribe(results => {
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
}
