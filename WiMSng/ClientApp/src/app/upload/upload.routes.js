"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const asn_component_1 = require("./asn/asn.component");
const so_component_1 = require("./so/so.component");
exports.uploadRoutes = [
    { path: 'ASN', component: asn_component_1.ASNComponent, canActivate: [auth_guard_1.AuthGuard], data: { title: 'ASN' } },
    { path: 'SO', component: so_component_1.SOComponent, canActivate: [auth_guard_1.AuthGuard], data: { title: 'SO' } }
];
//# sourceMappingURL=upload.routes.js.map