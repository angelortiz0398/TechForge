import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
import { CommonModule, DOCUMENT } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text?: string;
}
@Component({
    selector: 'app-root',
    imports: [MatToolbarModule, HomepageModule, MainLayoutComponent, FooterComponent, MatSidenavModule,
        MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, CommonModule, MatSlideToggleModule, MatMenuModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [DropfileDirective]
})
export class AppComponent  implements PreloadingStrategy, OnInit {

  // Suscribe adjustStyles al evento resize de la ventana
  @HostListener('window:resize', ['$event'])
  onResize($event?: any) {
    this.adjustStyles();
  }
  routeA : ActivatedRoute | undefined;
  OscuroActivado = true;
  iconosEnToolbar = false;
  constructor(_routeA: ActivatedRoute, private _snackBar: MatSnackBar, private router: Router, @Inject(DOCUMENT) private document: Document) {
    this.routeA = _routeA;
  }
  ngOnInit(): void {
    // console.log('this.routeA!.routeConfig?.path: ', this.routeA);
    this.routeActual = this.routeA!.routeConfig?.path as string;
    this.CambioModoOscuro();
    this.onResize();
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

  close(reason: string) {
    this.sidenav.close();
  }


  Compartir() {
    // Obtenemos la URL actual del navegador
    const currentURL = window.location.href;

    // Creamos un elemento temporal de tipo input
    const tempInput = document.createElement('input');

    // Asignamos la URL actual como valor al elemento temporal
    tempInput.value = currentURL;

    // Añadimos el elemento temporal al DOM
    document.body.appendChild(tempInput);

    // Seleccionamos el contenido del input
    tempInput.select();

    // Copiamos el contenido seleccionado al portapapeles
    document.execCommand('copy');

    // Eliminamos el elemento temporal del DOM
    document.body.removeChild(tempInput);

    // Notificamos al usuario que la URL ha sido copiada
    // this._snackBar.open('URL copiada al portapapeles: ' + currentURL, 'Cerrar', {
    //   horizontalPosition: 'center',
    //   verticalPosition: ''
    // });
    alert('URL copiada al portapapeles: ' + currentURL);
  }
  CambioModoOscuro() {
    this.OscuroActivado = !this.OscuroActivado;
    if (this.OscuroActivado) {
      this.document.documentElement.style.colorScheme = 'light';
    } else {
      this.document.documentElement.style.colorScheme = 'dark';
    }
  }
  redireccionarHome() {
    window.location.replace('/home/');
  }

  redireccionarPrincipal() {
    window.location.replace('/');
  }
  redireccionarConversorXMLToXLSX() {
    window.location.replace('/conversion-xml-to-xlsx/');
  }

  adjustStyles() {
    if(typeof window !== 'undefined') {
      if (window.innerWidth <= 600) {
        this.iconosEnToolbar = true;
      } else {
        this.iconosEnToolbar = false;
      }
    }
  }
}
