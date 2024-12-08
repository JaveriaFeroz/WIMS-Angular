"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const accessorialcharge_component_1 = require("./accessorialcharge/accessorialcharge.component");
const calendar_component_1 = require("./calendar/calendar.component");
const chargetype_component_1 = require("./chargetype/chargetype.component");
const costhead_component_1 = require("./costhead/costhead.component");
const cptemplate_component_1 = require("./cptemplate/cptemplate.component");
const kam_component_1 = require("./kam/kam.component");
const profitcenter_component_1 = require("./profitcenter/profitcenter.component");
const storergroup_component_1 = require("./storergroup/storergroup.component");
const supplier_component_1 = require("./supplier/supplier.component");
const usermanagement_component_1 = require("./usermanagement/usermanagement.component");
const whtaxexemption_component_1 = require("./whtaxexemption/whtaxexemption.component");
exports.masterRoutes = [
    { path: 'Supplier', component: supplier_component_1.SupplierComponent, canActivate: [auth_guard_1.AuthGuard], data: { title: 'Supplier Setup' } },
    {
        path: 'AccessorialCharge', component: accessorialcharge_component_1.AccessorialChargeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Accessorial Charge Setup' }
    },
    {
        path: 'ChargeType', component: chargetype_component_1.ChargeTypeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Charge Type Setup' }
    },
    {
        path: 'ExpenseType', component: costhead_component_1.CostHeadComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Expense Type Setup' }
    },
    {
        path: 'KAM', component: kam_component_1.KAMComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'KAM Setup' }
    },
    {
        path: 'WHTExemption', component: whtaxexemption_component_1.WHTaxExemptionComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'WHT Exemption' }
    },
    {
        path: 'CPTemplate', component: cptemplate_component_1.CPTemplateComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Cost Provision Template' }
    },
    {
        path: 'StorerGroup', component: storergroup_component_1.StorerGroupComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Storer Group Setup' }
    },
    {
        path: 'Calendar', component: calendar_component_1.CalendarComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Calendar Setup' }
    },
    {
        path: 'ProfitCenter', component: profitcenter_component_1.ProfitCenterComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Profit Center Setup' }
    },
    {
        path: 'UserManagement', component: usermanagement_component_1.UserManagementComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'User Management' }
    }
];
//# sourceMappingURL=master.routes.js.map