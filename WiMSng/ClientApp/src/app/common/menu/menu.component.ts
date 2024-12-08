import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { LoginService } from '../login/login.service';
import { Menu } from './menu';

@Component({
  selector: 'app-Menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  model: any = {};
  MenuAccess: Menu[];

  constructor(private router: Router, private toast: agToasterService, private auth: AuthService, private loginSvc: LoginService) { }

  ngOnInit() {
    this.model.UserName = this.auth.getUserName();    
    this.MenuAccess = JSON.parse(sessionStorage.getItem("UserMenu"));
  }

  LogOut() {
    this.auth.logout();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
