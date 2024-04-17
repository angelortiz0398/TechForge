import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HomeComponent } from './homepage/home/home.component';
import { ArrivalPageComponent } from './homepage/arrival-page/arrival-page.component';

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
  // { path: '',   redirectTo: '', pathMatch: 'full' },
  { path: '',   component: ArrivalPageComponent },
  { path: '**', component: PageNotFoundComponent, outlet: 'popup' }
];
