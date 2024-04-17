import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HomeComponent } from './homepage/home/home.component';

export const routes: Routes = [
  {
    path: 'conversion-xml-to-xlsx',
    component: AppComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    pathMatch: 'full'
  },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, outlet: 'popup' }
];
