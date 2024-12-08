"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
const shared_module_1 = require("../shared.module");
const costprovision_component_1 = require("./costprovision/costprovision.component");
const handlingdoc_component_1 = require("./handlingdoc/handlingdoc.component");
const operation_routes_1 = require("./operation.routes");
const variablesqft_component_1 = require("./variablesqft/variablesqft.component");
let OperationModule = class OperationModule {
};
OperationModule = __decorate([
    core_1.NgModule({
        declarations: [handlingdoc_component_1.HandlingDocComponent, costprovision_component_1.CostProvisionComponent, variablesqft_component_1.VariableSqFtComponent],
        imports: [
            router_1.RouterModule.forChild(operation_routes_1.operationRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], OperationModule);
exports.OperationModule = OperationModule;
//# sourceMappingURL=operation.module.js.map