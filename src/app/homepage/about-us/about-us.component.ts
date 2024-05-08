import { Component, HostListener, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  @HostListener('window:resize', ['$event'])

  ngOnInit(): void {
    this.onResize(); // No es necesario pasar ningún argumento aquí
  }
  colspanIzquierda: number = 6;
  colspanDerecha: number = 6;

  onResize(event?: any) { // Evento es opcional aquí
    if (window.innerWidth <= 1280) { // Accediendo directamente al ancho de la ventana
      this.colspanIzquierda = 0;
      this.colspanDerecha = 12;
    } else {
      this.colspanIzquierda = 6;
      this.colspanDerecha = 6;
    }
  }
}
