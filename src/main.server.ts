import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask'

var conf = config;
const maskConfig: Partial<IConfig> = {
  validation: false,
};
conf.providers.push(provideEnvironmentNgxMask(maskConfig));

const bootstrap = () => bootstrapApplication(AppComponent, conf);

export default bootstrap;
