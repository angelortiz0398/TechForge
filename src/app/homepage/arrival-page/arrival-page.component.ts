import { Contacto } from './../../entities/Contacto';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridList, MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { merge } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-arrival-page',
  standalone: true,
  imports: [MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    NgxMaskDirective,
    MatIcon,
    MatCardModule,
    HttpClientModule
  ],
  providers: [provideNgxMask()],
  templateUrl: './arrival-page.component.html',
  styleUrl: './arrival-page.component.css'
})
export class ArrivalPageComponent implements OnInit {
  HttpClient: any;
    // Suscribe adjustStyles al evento resize de la ventana
    @HostListener('window:resize', ['$event'])
    onResize($event: any) {
      this.adjustStyles();
    }


  // Variables para el formulario
  telefonoFormateado = '';
  nombreCompleto = '';
  correoElectronico = '';
  nombreCompania = '';
  nombre = new FormControl('', [Validators.required]);
  compania = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
  telefono = new FormControl('', [Validators.required, Validators.maxLength(13), Validators.minLength(10),
    Validators.pattern(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,3}))\s*$/)]);
  servicios = new FormControl([], [Validators.required]);
  ayuda = new FormControl('');
  floatLabelControl = new FormControl('always' as FloatLabelType);
  options = this._formBuilder.group({
    floatLabel: this.floatLabelControl,
  });
  errorMessage = '';

  // Variables generales
  rowHeight = '85%';

  colsPanServicios = 12;
  colsPanDescripcion = 12;
  colsPanGaleria = 12;
  colsPanFormulario = 6;

  colsPanBanner = 12;
  colsPanLateralIzquierdo = 0;
  colsPanLateralDerecho = 0;
  colsPanComplementoFormulario = 6;
  mostraImagenesLogos = true;

  // Variables para los servicios
  muestraSEO = false;
  muestraDisenioWeb = false;
  muestraBlogs = false;
  muestraResponsividad = false;
  muestraCreacionSecciones = false;
  muestraIntegracionRedes = false;
  muestraContenidoIlimitado = false;
  constructor(private _formBuilder: FormBuilder, private http: HttpClientModule) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  ngOnInit(): void {
    // Llamar a la función inicialmente y luego cada vez que cambie el tamaño de la ventana
    this.adjustStyles();
  }
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'El correo electrónico es requerido';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'No es un correo electrónico valido';
    } else {
      this.errorMessage = '';
    }
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'always';
  }

  getPlaceholderText(): string {
    return 'Servicios de su interes';
  }
  // Función para determinar si la pantalla es pequeña
  isSmallScreen() {
    return window.innerWidth <= 360;
  }

// Función para aplicar o quitar la clase según el tamaño de la pantalla
  adjustStyles() {
    const grid = document.getElementById('grid') as any as MatGridList;
    if (window.innerWidth <= 430) {
      this.rowHeight = '75%';
      this.colsPanServicios = 12;
      this.colsPanDescripcion = 12;
      this.colsPanGaleria = 12;
      this.colsPanFormulario = 12;

      this.colsPanLateralIzquierdo = 0;
      this.colsPanLateralDerecho = 0;
      this.colsPanComplementoFormulario = 12;
      this.mostraImagenesLogos = false;
    }else {
      this.rowHeight = '85%';

      this.colsPanServicios = 12;
      this.colsPanDescripcion = 12;
      this.colsPanGaleria = 12;
      this.colsPanFormulario = 6;

      this.colsPanLateralIzquierdo = 0;
      this.colsPanLateralDerecho = 0;
      this.colsPanComplementoFormulario = 6;
      this.mostraImagenesLogos = false;
    }

    if(window.innerWidth >= 1280) {
      this.mostraImagenesLogos = true;
    }
  }

  // Método para realizar la solicitud POST
  enviarFormulario() {
    this.nombre.markAsTouched();
    this.compania.markAsTouched();
    this.email.markAsTouched();
    this.telefono.markAsTouched();
    this.servicios.markAsTouched();
    this.ayuda.markAsTouched();
    let contacto: Contacto;
    if(this.nombre.invalid || this.compania.invalid || this.email.invalid || this.telefono.invalid || this.servicios.invalid || this.ayuda.invalid) {
      console.log("Invalido");
      return;
    }
    else{
      contacto = {
        id: 0,
        nombre: this.nombre.value!,
        email: this.email.value!,
        telefono: this.telefono.value!,
        nombreCompania: this.compania.value!,
        servicioInteres: this.servicios.value!.toString(),
        comentarioAyuda: this.ayuda.value!
      }
    }
    console.log("contacto: ", contacto);

    // URL a la que enviarás la solicitud POST
    const url = 'https://techforge-api.somee.com/Contacto/Guardar';

    const headers: Headers = new Headers()
    headers.set('Content-Type', 'application/json')
    // We also need to set the `Accept` header to `application/json`
    // to tell the server that we expect JSON in response
    headers.set('Accept', 'application/json')
    headers.set('Access-Control-Allow-Origin', '*')

    const request: RequestInfo = new Request(url, {
      // We need to set the `method` to `POST` and assign the headers
      method: 'POST',
      headers: headers,
      // Convert the user object to JSON and pass it as the body
      body: JSON.stringify(contacto)
    })

    // Send the request and print the response
    return fetch(request)
      .then(res => {
        console.log("got response:", res)
      })
  }
}
