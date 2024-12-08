"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayoutComponent = void 0;
const core_1 = require("@angular/core");
//import { TabService } from "./tab.service";
//import { TabContentComponent } from "./tab-content.component"
//import { Tab } from "./tab.model";
let MainLayoutComponent = 
// implements OnInit
class MainLayoutComponent {
    //tabs = new Array<Tab>();
    //selectedTab: number;//, private tabService: TabService
    constructor(router, auth) {
        this.router = router;
        this.auth = auth;
    }
    //ngOnInit() {
    //  this.tabService.tabSub.subscribe(tabs => {
    //    this.tabs = tabs;
    //    this.selectedTab = tabs.findIndex(tab => tab.active);
    //  });
    //}
    //LogOut() {
    //  this.auth.logout();
    //  sessionStorage.clear();
    //  this.router.navigate(['/login']);    
    //}
    //tabChanged(event) {
    //  console.log("tab changed");
    //}
    //addNewTab() {
    //  this.tabService.addTab(
    //    new Tab("HoseTypeComponent", "Sadiq", { parent: MainLayoutComponent })
    //    //new Tab(Comp1Component, "Comp1 View", { parent: "MainComponent" })
    //  );
    //}
    //removeTab(index: number): void {
    //  this.tabService.removeTab(index);
    //}
    redirectTo(uri) {
        ///alert(uri);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }
};
MainLayoutComponent = __decorate([
    core_1.Component({
        selector: 'app-main-layout',
        templateUrl: './main-layout.component.html',
        styleUrls: ['./main-layout.component.css']
    })
    // implements OnInit
], MainLayoutComponent);
exports.MainLayoutComponent = MainLayoutComponent;
//# sourceMappingURL=main-layout.component.js.map