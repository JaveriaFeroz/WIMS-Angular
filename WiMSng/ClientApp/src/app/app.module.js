"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const http_1 = require("@angular/common/http");
const core_1 = require("@angular/core");
const core_2 = require("@angular/material/core");
const platform_browser_1 = require("@angular/platform-browser");
const animations_1 = require("@angular/platform-browser/animations");
const router_1 = require("@angular/router");
const ag_grid_angular_1 = require("ag-grid-angular");
const app_component_1 = require("./app.component");
const app_material_module_1 = require("./app.material.module");
const app_routes_1 = require("./app.routes");
const login_layout_component_1 = require("./common/login/login-layout.component");
const login_component_1 = require("./common/login/login.component");
const login_service_1 = require("./common/login/login.service");
const main_layout_component_1 = require("./common/main/main-layout.component");
/*import { MainComponent } from './common/main/main.component';*/
const Menu_component_1 = require("./common/menu/Menu.component");
const myform_component_1 = require("./common/myform/myform.component");
const uploadform_component_1 = require("./common/uploadform/uploadform.component");
const filter_pipe_1 = require("./filter.pipe");
const agGrid_date_component_1 = require("./helper/agGrid-date.component");
/*import { agGridTimeEditor } from "./helper/agGrid-time.component";*/
const agGridHelper_1 = require("./helper/agGridHelper");
const page_not_found_component_1 = require("./helper/error/page-not-found.component");
const auth_guard_1 = require("./helper/guard/auth.guard");
const auth_service_1 = require("./helper/service/auth.service");
const shared_module_1 = require("./shared.module");
/*import { PageNotAuthorizedComponent } from './helper/error/page-not-authorized.component';*/
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent, login_component_1.LoginComponent, login_layout_component_1.LoginLayoutComponent, main_layout_component_1.MainLayoutComponent, Menu_component_1.MenuComponent,
            page_not_found_component_1.PageNotFoundComponent, myform_component_1.MyFormComponent, uploadform_component_1.UploadFormComponent, filter_pipe_1.numFilterPipe, filter_pipe_1.stringFilterPipe, agGrid_date_component_1.agGridDateEditor
        ],
        imports: [
            platform_browser_1.BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
            http_1.HttpClientModule,
            animations_1.BrowserAnimationsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule.forRoot(),
            router_1.RouterModule.forRoot(app_routes_1.mainRoutes),
            ag_grid_angular_1.AgGridModule.withComponents([agGrid_date_component_1.agGridDateEditor])
        ],
        entryComponents: [],
        providers: [login_service_1.LoginService, auth_service_1.AuthService, auth_guard_1.AuthGuard, agGridHelper_1.agGridHelper, { provide: core_2.MAT_DATE_LOCALE, useValue: 'en-GB' }],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map