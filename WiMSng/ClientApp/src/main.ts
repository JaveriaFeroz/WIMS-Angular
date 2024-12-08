import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { debug } from 'console';
import { AppModule } from './app/app.module';
//import { environment } from './environments/environment.dev';
//import { environment } from './environments/environment.prod';
//import { environment } from './environments/environment.uat';
import { environment } from './environments/environment';

export function getAPIBaseUrl() {
  //if (environment.production)
  //  return "https://pakistanportal.agility.com/wimsAPI/";
  //else if (environment.uat)
  //  return "/wimsAPI/";//"http://10.141.0.11:1594/wimsAPI/";
  //else
  //  return "http://localhost:22434/";/*https://localhost:44311/wimsAPI/*/
  //return "https://wims.appspk.net.pk/WiMSAPI/";
  return "http://localhost:22434/";
}

const providers = [
  { provide: 'API_BASE_URL', useFactory: getAPIBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));


