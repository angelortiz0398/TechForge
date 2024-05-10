import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css'
})
export class OurServicesComponent implements OnInit {
  @HostListener('window:resize', ['$event'])

  ngOnInit(): void {
    this.onResize(); // No es necesario pasar ningún argumento aquí
  }
  colspanIzquierda: number = 5;
  colspanDerecha: number = 7;

    // Variables para los servicios
    muestraSEO = false;
    muestraDisenioWeb = false;
    muestraBlogs = false;
    muestraResponsividad = false;
    muestraCreacionSecciones = false;
    muestraIntegracionRedes = false;
    muestraContenidoIlimitado = false;
    muestraDescripcionServicios = false;
    mostrarResumenConSlogan = true;

  onResize(event?: any) { // Evento es opcional aquí
    if (window.innerWidth <= 1280) { // Accediendo directamente al ancho de la ventana
      this.colspanIzquierda = 0;
      this.colspanDerecha = 12;
      // this.muestraDescripcionServicios = true;
    } else {
      this.colspanIzquierda = 5;
      this.colspanDerecha = 7;
      // this.muestraDescripcionServicios = false;
    }
  }
}
