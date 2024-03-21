import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomepageModule } from './app/homepage/homepage.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



// platformBrowserDynamic().bootstrapModule(HomepageModule).then(ref => {
//   // Ensure Angular destroys itself on hot reloads.
//   // if (window['ngRef']) {
//   //   window['ngRef'].destroy();
//   // }
//   // window['ngRef'] = ref;

//   // Otherise, log the boot error
// }).catch(err => console.error(err));
