import { Component, HostListener } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  colspanIzquierda: number = 6;
  colspanDerecha: number = 6;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1280) {
      this.colspanIzquierda = 0;
      this.colspanDerecha = 12; // Cambia a 12 columna cuando el ancho de la ventana es menor a 420px
    } else {
      this.colspanIzquierda = 6; // Cambia a 6 columnas por defecto
      this.colspanDerecha = 6; // Cambia a 6 columnas por defecto
    }
  }
}
