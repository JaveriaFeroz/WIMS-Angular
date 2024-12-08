"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const costprovision_component_1 = require("./costprovision/costprovision.component");
const handlingdoc_component_1 = require("./handlingdoc/handlingdoc.component");
const variablesqft_component_1 = require("./variablesqft/variablesqft.component");
exports.operationRoutes = [
    {
        path: 'HandlingDocument', component: handlingdoc_component_1.HandlingDocComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: ' Handling Document' }
    },
    {
        path: 'CostProvision', component: costprovision_component_1.CostProvisionComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Cost Provisions' }
    },
    {
        path: 'VariableSquareFeet', component: variablesqft_component_1.VariableSqFtComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Variable Square Feet' }
    }
];
//# sourceMappingURL=operation.routes.js.map