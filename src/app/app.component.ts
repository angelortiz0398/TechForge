import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HomepageModule } from './homepage/homepage.module';
import { MainLayoutComponent } from './homepage/main-layout/main-layout.component';
import { FooterComponent } from './homepage/footer/footer.component';
import { DropfileDirective } from './homepage/Dropfile.directive';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text?: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, RouterOutlet, HomepageModule, MainLayoutComponent, FooterComponent, MatSidenavModule,
    MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DropfileDirective]
})
export class AppComponent  implements PreloadingStrategy, OnInit {
  routeA : ActivatedRoute | undefined;
  constructor(_routeA: ActivatedRoute) {
    this.routeA = _routeA;
  }
  ngOnInit(): void {
    // console.log('this.routeA!.routeConfig?.path: ', this.routeA);
    this.routeActual = this.routeA!.routeConfig?.path as string;
  }


  routeActual: string  = '';
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.canMatch === undefined && route.data?.['preload'] && route.path != null) {
      // add the route path to the preloaded module array
      this.preloadedModules.push(route.path);

      // log the route path to the console
      console.log('Preloaded: ' + route.path);
      // this.routeActual = route.path;

      return load();
    } else {
      return of(null);
    }
  }
  preloadedModules: string[] = [];
  title = 'TechForge';
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  public route: Route | undefined;


  reason = '';
  tiles: Tile[] = [
    {cols: 1, rows: 1, color: 'lightblue'},
  ];
  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
}
