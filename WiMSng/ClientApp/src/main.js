"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPIBaseUrl = void 0;
const core_1 = require("@angular/core");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
//import { debug } from 'console';
const app_module_1 = require("./app/app.module");
//import { environment } from './environments/environment.dev';
//import { environment } from './environments/environment.prod';
//import { environment } from './environments/environment.uat';
const environment_1 = require("./environments/environment");
function getAPIBaseUrl() {
    //if (environment.production)
    //  return "https://pakistanportal.agility.com/wimsAPI/";
    //else if (environment.uat)
    //  return "/wimsAPI/";//"http://10.141.0.11:1594/wimsAPI/";
    //else
    //  return "http://localhost:22434/";/*https://localhost:44311/wimsAPI/*/
    //return "https://wims.appspk.net.pk/WiMSAPI/";
    return "http://localhost:22434/";
}
exports.getAPIBaseUrl = getAPIBaseUrl;
const providers = [
    { provide: 'API_BASE_URL', useFactory: getAPIBaseUrl, deps: [] }
];
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic(providers).bootstrapModule(app_module_1.AppModule)
    .catch(err => console.log(err));
//# sourceMappingURL=main.js.map