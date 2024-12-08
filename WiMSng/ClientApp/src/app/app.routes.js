"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoutes = void 0;
const login_layout_component_1 = require("./common/login/login-layout.component");
const main_layout_component_1 = require("./common/main/main-layout.component");
const myform_component_1 = require("./common/myform/myform.component");
const uploadform_component_1 = require("./common/uploadform/uploadform.component");
const page_not_found_component_1 = require("./helper/error/page-not-found.component");
const auth_guard_1 = require("./helper/guard/auth.guard");
const st_component_1 = require("./upload/st/st.component");
const LocationCategory_component_1 = require("./upload/LocationCategory/LocationCategory.component");
const Location_component_1 = require("./upload/Location/Location.component");
const Storer_component_1 = require("./upload/Storer/Storer.component");
const Packkey_component_1 = require("./upload/Packkey/Packkey.component");
const SKU_component_1 = require("./upload/SKU/SKU.component");
const ITRN_component_1 = require("./upload/ITRN/ITRN.component");
const asn_component_1 = require("./upload/ASN/asn.component");
const so_component_1 = require("./upload/SO/so.component");
exports.mainRoutes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: login_layout_component_1.LoginLayoutComponent, data: { title: 'Login' } },
    { path: 'MainForm', component: main_layout_component_1.MainLayoutComponent, canActivate: [auth_guard_1.AuthGuard], data: { title: 'Main' } },
    { path: 'common/MyForm', component: myform_component_1.MyFormComponent, canActivate: [auth_guard_1.AuthGuard], data: { title: 'My Forms' } },
    { path: 'common/UploadForm', component: uploadform_component_1.UploadFormComponent, canActivate: [auth_guard_1.AuthGuard], data: { title: 'Upload Forms' } },
    { path: 'master', loadChildren: () => Promise.resolve().then(() => require('./master/master.module')).then(m => m.MasterModule) },
    { path: 'finance', loadChildren: () => Promise.resolve().then(() => require('./finance/finance.module')).then(m => m.FinanceModule) },
    { path: 'operation', loadChildren: () => Promise.resolve().then(() => require('./operation/operation.module')).then(m => m.OperationModule) },
    // { path: 'upload', loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule) },
    { path: 'ST', component: st_component_1.STComponent, data: { title: 'ST' } },
    { path: 'LocationCategory', component: LocationCategory_component_1.LocationCategoryComponent, data: { title: 'LocationCategory' } },
    { path: 'Location', component: Location_component_1.LocationComponent, data: { title: 'Location' } },
    { path: 'Storer', component: Storer_component_1.StorerComponent, data: { title: 'Storer' } },
    { path: 'Packkey', component: Packkey_component_1.PackkeyComponent, data: { title: 'Packkey' } },
    { path: 'SKU', component: SKU_component_1.SKUComponent, data: { title: 'SKU' } },
    { path: 'ITRN', component: ITRN_component_1.ITRNComponent, data: { title: 'ITRN' } },
    { path: 'ASN', component: asn_component_1.asnComponent, data: { title: 'ITRN' } },
    { path: 'SO', component: so_component_1.soComponent, data: { title: 'ITRN' } },
    { path: '**', component: page_not_found_component_1.PageNotFoundComponent }
];
//# sourceMappingURL=app.routes.js.map