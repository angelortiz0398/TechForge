import { DropfileDirective, FileHandle } from './../Dropfile.directive';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProgressComponent } from '../progress/progress.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { DialogSelectorColumnComponent } from '../dialog-selector-column/dialog-selector-column.component';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ActivatedRoute, PreloadingStrategy, Route, RouterOutlet } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { Observable, of } from 'rxjs';
import { HomeComponent } from '../home/home.component';
import { ConversorXmlXlsxComponent } from '../conversor-xml-xlsx/conversor-xml-xlsx.component';
import { ArrivalPageComponent } from '../arrival-page/arrival-page.component';


interface Columna {
  nombre: string;
  seleccionada: boolean;
}

interface Fila {
  [key: string]: any;
}
@Component({
    selector: 'app-main-layout',
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatIconModule,
        MatPaginatorModule,
        HomeComponent,
        ConversorXmlXlsxComponent,
        ArrivalPageComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements PreloadingStrategy, OnInit{

  routeA : ActivatedRoute | undefined;
  routeActual: string  = '';
  preloadedModules: string[] = [];
  constructor(public dialog: MatDialog, _routeA: ActivatedRoute,  @Inject(DOCUMENT) private document: Document) {
    this.routeA = _routeA;
  }
  ngOnInit(): void {
    // console.log('this.routeA!.routeConfig?.path: ', this.routeA);
    this.routeActual = this.routeA!.routeConfig?.path as string;
    this.obtenerURLActual();
  }
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.canMatch === undefined && route.data?.['preload'] && route.path != null) {
      // add the route path to the preloaded module array
      this.preloadedModules.push(route.path);

      // log the route path to the console
      console.log('Preloaded: ' + route.path);
      this.routeActual = route.path;

      return load();
    } else {
      return of(null);
    }
  }
  obtenerURLActual(): void {
    // Verificar si window está definido (para evitar errores en entornos no relacionados con el navegador)
    if (typeof window !== 'undefined') {
      this.routeActual = window.location.pathname;
    }
  }
}

