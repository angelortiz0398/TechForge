import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask'

var config = appConfig;
const maskConfig: Partial<IConfig> = {
  validation: false,
};
config.providers.push(provideEnvironmentNgxMask(maskConfig));

bootstrapApplication(AppComponent, config).catch((err) => console.error(err));
