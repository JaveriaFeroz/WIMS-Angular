"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
/*import { NumberDirective } from '../helper/numbers-only.directive';*/
const shared_module_1 = require("../shared.module");
const asn_component_1 = require("./asn/asn.component");
const so_component_1 = require("./so/so.component");
const upload_routes_1 = require("./upload.routes");
const st_component_1 = require("./st/st.component");
const LocationCategory_component_1 = require("./LocationCategory/LocationCategory.component");
let UploadModule = class UploadModule {
};
UploadModule = __decorate([
    core_1.NgModule({
        declarations: [asn_component_1.ASNComponent, so_component_1.SOComponent, st_component_1.STComponent, LocationCategory_component_1.LocationCategoryComponent],
        imports: [
            router_1.RouterModule.forChild(upload_routes_1.uploadRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
            //AgGridModule.withComponents([MyDateEditor])
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], UploadModule);
exports.UploadModule = UploadModule;
//# sourceMappingURL=upload.module.js.map