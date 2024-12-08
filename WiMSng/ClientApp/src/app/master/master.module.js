"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
/*import { NumberDirective } from '../helper/numbers-only.directive';*/
const shared_module_1 = require("../shared.module");
const accessorialcharge_component_1 = require("./accessorialcharge/accessorialcharge.component");
const calendar_component_1 = require("./calendar/calendar.component");
const chargetype_component_1 = require("./chargetype/chargetype.component");
const costhead_component_1 = require("./costhead/costhead.component");
const cptemplate_component_1 = require("./cptemplate/cptemplate.component");
const kam_component_1 = require("./kam/kam.component");
const master_routes_1 = require("./master.routes");
const profitcenter_component_1 = require("./profitcenter/profitcenter.component");
const storergroup_component_1 = require("./storergroup/storergroup.component");
const supplier_component_1 = require("./supplier/supplier.component");
const usermanagement_component_1 = require("./usermanagement/usermanagement.component");
const whtaxexemption_component_1 = require("./whtaxexemption/whtaxexemption.component");
let MasterModule = class MasterModule {
};
MasterModule = __decorate([
    core_1.NgModule({
        declarations: [usermanagement_component_1.UserManagementComponent, supplier_component_1.SupplierComponent,
            accessorialcharge_component_1.AccessorialChargeComponent, whtaxexemption_component_1.WHTaxExemptionComponent, costhead_component_1.CostHeadComponent, chargetype_component_1.ChargeTypeComponent, kam_component_1.KAMComponent,
            cptemplate_component_1.CPTemplateComponent, storergroup_component_1.StorerGroupComponent, calendar_component_1.CalendarComponent, profitcenter_component_1.ProfitCenterComponent],
        imports: [
            router_1.RouterModule.forChild(master_routes_1.masterRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
            //AgGridModule.withComponents([MyDateEditor])
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], MasterModule);
exports.MasterModule = MasterModule;
//# sourceMappingURL=master.module.js.map