import { DropfileDirective, FileHandle } from './../Dropfile.directive';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProgressComponent } from '../progress/progress.component';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import * as xml2js from 'xml2js';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { delay } from 'rxjs';
import { DialogSelectorColumnComponent } from '../dialog-selector-column/dialog-selector-column.component';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
} from '@angular/material/dialog';

interface Columna {
  nombre: string;
  seleccionada: boolean;
}

interface Fila {
  [key: string]: any;
}
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    ProgressComponent,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    DropfileDirective,
    MatDividerModule,
    MatCardModule,
    DialogSelectorColumnComponent,
    MatIconModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Nomina>(ELEMENT_DATA);
  bodyXML: any;
  files: FileHandle[] = [];
  sanitizer: any;
  columnasNomina: Columna[] = []; // Lista de columnas para nomina
  columnasIngreso: Columna[] = []; // Lista de columnas para ingreso
  columnasEgreso: Columna[] = []; // Lista de columnas para egreso
  columnasTraslado: Columna[] = []; // Lista de columnas para traslado
  columnasRetenciones: Columna[] = []; // Lista de columnas para retenciones
  columnas: Columna[] = []; // Lista de columnas para Recepción de Pagos
  datosNomina: Fila[] = []; // Lista de datos
  datosIngreso: Fila[] = []; // Lista de datos
  datosEgreso: Fila[] = []; // Lista de datos
  datosTraslado: Fila[] = []; // Lista de datos
  datosRetenciones: Fila[] = []; // Lista de datos
  datos: Fila[] = []; // Lista de datos para nomina Recepción de Pagos
  displayedColumnsNomina: string[] = [
    'id',
    'xmlns:xsi',
    'xsi:schemaLocation',
    'xmlns:cfdi',
    'xmlns:nomina12',
    'Version',
    'Fecha',
    'Sello',
    'NoCertificado',
    'Certificado',
    'Moneda',
    'TipoDeComprobante',
    'Exportacion',
    'MetodoPago',
    'Serie',
    'Folio',
    'LugarExpedicion',
    'SubTotal',
    'Descuento',
    'Total',
    'cfdi:Emisor:RegimenFiscal',
    'cfdi:Emisor:Rfc',
    'cfdi:Emisor:Nombre',
    'cfdi:Receptor:Rfc',
    'cfdi:Receptor:Nombre',
    'cfdi:Receptor:DomicilioFiscalReceptor',
    'cfdi:Receptor:RegimenFiscalReceptor',
    'cfdi:Receptor:UsoCFDI',
    'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ',
    'cfdi:Conceptos:cfdi:Concepto:Cantidad',
    'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad',
    'cfdi:Conceptos:cfdi:Concepto:Descripcion',
    'cfdi:Conceptos:cfdi:Concepto:ObjetoImp',
    'cfdi:Conceptos:cfdi:Concepto:ValorUnitario',
    'cfdi:Conceptos:cfdi:Concepto:Importe',
    'cfdi:Conceptos:cfdi:Concepto:Descuento',
    'cfdi:Complemento:nomina12:Nomina:Version',
    'cfdi:Complemento:nomina12:Nomina:TipoNomina',
    'cfdi:Complemento:nomina12:Nomina:FechaPago',
    'cfdi:Complemento:nomina12:Nomina:FechaInicialPago',
    'cfdi:Complemento:nomina12:Nomina:FechaFinalPago',
    'cfdi:Complemento:nomina12:Nomina:NumDiasPagados',
    'cfdi:Complemento:nomina12:Nomina:TotalPercepciones',
    'cfdi:Complemento:nomina12:Nomina:TotalDeducciones',
    'cfdi:Complemento:nomina12:Nomina:TotalOtrosPagos',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Emisor:RegistroPatronal',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Curp',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumSeguridadSocial',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:FechaInicioRelLaboral',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Antigüedad',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoContrato',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Sindicalizado',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoJornada',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoRegimen',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumEmpleado',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Departamento',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Puesto',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:RiesgoPuesto',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:PeriodicidadPago',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioBaseCotApor',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioDiarioIntegrado',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:ClaveEntFed',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalSueldos',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalGravado',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalExento',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:TipoPercepcion',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Clave',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Concepto',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteGravado',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteExento',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalOtrasDeducciones',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalImpuestosRetenidos',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:TipoDeduccion',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Clave',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Concepto',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Importe',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:TipoDeduccion',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Clave',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Concepto',
    'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Importe',
    'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:TipoOtroPago',
    'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Clave',
    'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Concepto',
    'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Importe',
    'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:nomina12:SubsidioAlEmpleo:SubsidioCausado',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:Version',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:UUID',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT',
  ];
  displayedColumnsNominaSelected: string[] = [];
  animal!: string;
  name!: string;

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.displayedColumnsNominaSelected = this.displayedColumnsNomina;
  }

  filesDropped(files: any): void {
    this.files = files;
  }

  AbrirPopupFiles(): void {
    if (this.files.length > 0) {
      this.files = [];
    }
    const inputElement: HTMLInputElement = this.fileInput.nativeElement;
    inputElement.click(); // Simular clic en el input de archivo
  }

  CleanFiles(): void {
    if (this.files.length > 0) {
      this.files = [];
    }
    ELEMENT_DATA = [];
    this.dataSource.data = [];
  }

  CargarArchivos(event: any): void {
    const url: SafeUrl = '';
    // Se asignan los archivos fisicos a la lista de files
    for (const archivo of event.target.files) {
      const fileHandle: FileHandle = { file: archivo, url: url };
      this.files.push(fileHandle);
    }

    for (let index = 0; index < event.target.files.length; index++) {
      const lector: FileReader = new FileReader();
      lector.onload = (e) => {
        const contenido: string = e.target!.result as string;
        this.bodyXML = contenido;
        // Ahora que tenemos el contenido del archivo, lo pasamos al parser xml2js
        const parser = new xml2js.Parser({
          explicitArray: false,
          mergeAttrs: true,
        });
        parser.parseString(contenido, (error, resultado) => {
          if (error) {
            console.error('Error al analizar el XML:', error);
          } else {
            console.log('Objeto JavaScript generado:', resultado);
            // Aquí puedes procesar el objeto JavaScript como desees
            this.procesarDatos(resultado);
          }
        });
      };
      lector.readAsText(event.target.files[index]);
    }
    console.log("archivos: ",event.target.files)
  }

  procesarDatos(datosXML: any): void {
    // Limpiar las columnas existentes
    this.columnas = [];
    this.datos = [];
    var propiedadPadre = '';
    if(datosXML['cfdi:Comprobante'] != undefined)
      propiedadPadre = 'cfdi:Comprobante';
    else
      propiedadPadre = 'retenciones:Retenciones';
    if (datosXML) {
      this.columnas.push({ nombre: 'id', seleccionada: true });
      // Función recursiva para manejar los objetos anidados
      const agregarColumnas = (objeto: any, prefijo: string = '') => {
        for (const clave in objeto) {
          if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
            const valor = objeto[clave];
            const nombreColumna = prefijo + clave;

            if (typeof valor === 'object' && valor !== null) {
              // Si es un objeto, llamamos recursivamente a la función
              agregarColumnas(valor, nombreColumna + ':');
            } else {
              // Agregar la clave como columna si no existe
              if (
                !this.columnas.some(
                  (columna) => columna.nombre === nombreColumna
                )
              ) {
                this.columnas.push({
                  nombre: nombreColumna,
                  seleccionada: true,
                });
              }
            }
          }
        }
      };

      // Iterar sobre las propiedades del objeto JSON
      for (const propiedad in datosXML[propiedadPadre]) {
        if (
          Object.prototype.hasOwnProperty.call(
            datosXML[propiedadPadre],
            propiedad
          )
        ) {
          const valor = datosXML[propiedadPadre][propiedad];
          if (typeof valor === 'object' && valor !== null) {
            // Si es un objeto, llamamos recursivamente a la función
            agregarColumnas(valor, propiedad + ':');
          } else {
            // Agregar la clave como columna si no existe
            if (
              !this.columnas.some((columna) => columna.nombre === propiedad)
            ) {
              this.columnas.push({ nombre: propiedad, seleccionada: true });
            }
          }
        }
      }

      // Construct filas only if columnas has valid data
      if (this.columnas.length > 0) {
        const fila: Fila = {};
        for (const columna of this.columnas) {
          fila['id'] = 1;
          const partes = columna.nombre.split(':');

          // Unir las partes deseadas de dos en dos
          const subcadenas = [];
          for (let i = 0; i < partes.length; i += 2) {
            const subcadena = partes.slice(i, i + 2).join(':');
            subcadenas.push(subcadena);
          }
          if (subcadenas.length == 0) {
            fila[columna.nombre] = datosXML[propiedadPadre][columna.nombre];
          } else {
            switch (subcadenas.length) {
              case 1:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]];
                break;
              case 2:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]];
                break;
              case 3:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ];
                break;
              case 4:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ][subcadenas[3]];
                break;
              case 5:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ][subcadenas[3]][subcadenas[4]];
                break;
              case 6:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ][subcadenas[3]][subcadenas[4]][subcadenas[5]];
                break;
              case 7:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ][subcadenas[3]][subcadenas[4]][subcadenas[5]][subcadenas[6]];
                break;
            }
          }
        }
        this.datos = [fila];
      }
    }
    console.log('columnas: ', this.columnas);
    console.log('datos: ', this.datos);

    ELEMENT_DATA = [];
    this.datos.forEach((dato) => {
      var ob: Nomina = {
        id: dato['id'],
        'xmlns:xsi': dato['xmlns:xsi'],
        'xsi:schemaLocation': dato['xsi:schemaLocation'],
        'xmlns:cfdi': dato['xmlns:cfdi'],
        'xmlns:nomina12': dato['xmlns:nomina12'],
        Version: dato['Version'],
        Fecha: dato['Fecha'],
        Sello: dato['Sello'],
        NoCertificado: dato['NoCertificado'],
        Certificado: dato['Certificado'],
        Moneda: dato['Moneda'],
        TipoDeComprobante: dato['TipoDeComprobante'],
        Exportacion: dato['Exportacion'],
        MetodoPago: dato['MetodoPago'],
        Serie: dato['Serie'],
        Folio: dato['Folio'],
        LugarExpedicion: dato['LugarExpedicion'],
        SubTotal: dato['SubTotal'],
        Descuento: dato['Descuento'],
        Total: dato['Total'],
        'cfdi:Emisor:RegimenFiscal': dato['cfdi:Emisor:RegimenFiscal'],
        'cfdi:Emisor:Rfc': dato['cfdi:Emisor:Rfc'],
        'cfdi:Emisor:Nombre': dato['cfdi:Emisor:Nombre'],
        'cfdi:Receptor:Rfc': dato['cfdi:Receptor:Rfc'],
        'cfdi:Receptor:Nombre': dato['cfdi:Receptor:Nombre'],
        'cfdi:Receptor:DomicilioFiscalReceptor':
          dato['cfdi:Receptor:DomicilioFiscalReceptor'],
        'cfdi:Receptor:RegimenFiscalReceptor':
          dato['cfdi:Receptor:RegimenFiscalReceptor'],
        'cfdi:Receptor:UsoCFDI': dato['cfdi:Receptor:UsoCFDI'],
        'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ':
          dato['cfdi:Conceptos:cfdi:Concepto:ClaveProdServ'],
        'cfdi:Conceptos:cfdi:Concepto:Cantidad':
          dato['cfdi:Conceptos:cfdi:Concepto:Cantidad'],
        'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad':
          dato['cfdi:Conceptos:cfdi:Concepto:ClaveUnidad'],
        'cfdi:Conceptos:cfdi:Concepto:Descripcion':
          dato['cfdi:Conceptos:cfdi:Concepto:Descripcion'],
        'cfdi:Conceptos:cfdi:Concepto:ObjetoImp':
          dato['cfdi:Conceptos:cfdi:Concepto:ObjetoImp'],
        'cfdi:Conceptos:cfdi:Concepto:ValorUnitario':
          dato['cfdi:Conceptos:cfdi:Concepto:ValorUnitario'],
        'cfdi:Conceptos:cfdi:Concepto:Importe':
          dato['cfdi:Conceptos:cfdi:Concepto:Importe'],
        'cfdi:Conceptos:cfdi:Concepto:Descuento':
          dato['cfdi:Conceptos:cfdi:Concepto:Descuento'],
        'cfdi:Complemento:nomina12:Nomina:Version':
          dato['cfdi:Complemento:nomina12:Nomina:Version'],
        'cfdi:Complemento:nomina12:Nomina:TipoNomina':
          dato['cfdi:Complemento:nomina12:Nomina:TipoNomina'],
        'cfdi:Complemento:nomina12:Nomina:FechaPago':
          dato['cfdi:Complemento:nomina12:Nomina:FechaPago'],
        'cfdi:Complemento:nomina12:Nomina:FechaInicialPago':
          dato['cfdi:Complemento:nomina12:Nomina:FechaInicialPago'],
        'cfdi:Complemento:nomina12:Nomina:FechaFinalPago':
          dato['cfdi:Complemento:nomina12:Nomina:FechaFinalPago'],
        'cfdi:Complemento:nomina12:Nomina:NumDiasPagados':
          dato['cfdi:Complemento:nomina12:Nomina:NumDiasPagados'],
        'cfdi:Complemento:nomina12:Nomina:TotalPercepciones':
          dato['cfdi:Complemento:nomina12:Nomina:TotalPercepciones'],
        'cfdi:Complemento:nomina12:Nomina:TotalDeducciones':
          dato['cfdi:Complemento:nomina12:Nomina:TotalDeducciones'],
        'cfdi:Complemento:nomina12:Nomina:TotalOtrosPagos':
          dato['cfdi:Complemento:nomina12:Nomina:TotalOtrosPagos'],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Emisor:RegistroPatronal':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Emisor:RegistroPatronal'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Curp':
          dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Curp'],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumSeguridadSocial':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumSeguridadSocial'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:FechaInicioRelLaboral':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:FechaInicioRelLaboral'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Antigüedad':
          dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Antigüedad'],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoContrato':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoContrato'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Sindicalizado':
          dato[
            'xcfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Sindicalizado'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoJornada':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoJornada'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoRegimen':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoRegimen'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumEmpleado':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumEmpleado'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Departamento':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Departamento'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Puesto':
          dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Puesto'],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:RiesgoPuesto':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:RiesgoPuesto'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:PeriodicidadPago':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:PeriodicidadPago'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioBaseCotApor':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioBaseCotApor'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioDiarioIntegrado':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioDiarioIntegrado'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:ClaveEntFed':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:ClaveEntFed'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalSueldos':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalSueldos'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalGravado':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalGravado'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalExento':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalExento'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:TipoPercepcion':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:TipoPercepcion'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Clave':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Clave'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Concepto':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Concepto'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteGravado':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteGravado'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteExento':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteExento'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalOtrasDeducciones':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalOtrasDeducciones'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalImpuestosRetenidos':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalImpuestosRetenidos'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:TipoDeduccion':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:TipoDeduccion'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Clave':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Clave'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Concepto':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Concepto'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Importe':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Importe'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:TipoDeduccion':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:TipoDeduccion'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Clave':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Clave'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Concepto':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Concepto'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Importe':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Importe'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:TipoOtroPago':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:TipoOtroPago'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Clave':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Clave'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Concepto':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Concepto'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Importe':
          dato[
            'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Importe'
          ],
        'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:nomina12:SubsidioAlEmpleo:SubsidioCausado':
          dato['xmlns:xsi'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:Version':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:Version'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:UUID':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:UUID'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
        'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT':
          dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT'],
      };
      ELEMENT_DATA.push(ob);
      this.dataSource.data = ELEMENT_DATA;
    });
  }

  exportToExcel(): void {
    const inputElement: HTMLInputElement = this.fileInput.nativeElement;
    var nombreArchivo = inputElement.files![0].name.replace('.xml', '');
    const fileName = nombreArchivo + '.xlsx';

    // Datos de la tabla
    const datos = this.dataSource.data;
    // Filtrar solo las columnas que deseas imprimir

    const datosFiltrados = datos.map(item => {
        const newItem: any = {};
        this.displayedColumnsNominaSelected.forEach(columna => {
          newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
        });
        return newItem;
    });

    // Crear una nueva hoja de trabajo con los datos filtrados
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosFiltrados);


    // Crear un libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CFDI');

    // Guardar el libro de Excel
    XLSX.writeFile(wb, fileName);
  }

  openDialog(listaSeleccionada : string[]): void {
    const dialogRef = this.dialog.open(DialogSelectorColumnComponent, {
      disableClose: true,
      data: {
        columnSelected : listaSeleccionada,
        columnSelectedBoolean : Array(listaSeleccionada.length).fill(true)
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.displayedColumnsNominaSelected = result;
    });
  }
}
export interface Nomina {
  id: number;
  'xmlns:xsi': string;
  'xsi:schemaLocation': string;
  'xmlns:cfdi': string;
  'xmlns:nomina12': string;
  Version: string;
  Fecha: string;
  Sello: string;
  NoCertificado: string;
  Certificado: string;
  Moneda: string;
  TipoDeComprobante: string;
  Exportacion: string;
  MetodoPago: string;
  Serie: string;
  Folio: string;
  LugarExpedicion: string;
  SubTotal: string;
  Descuento: string;
  Total: string;
  'cfdi:Emisor:RegimenFiscal': string;
  'cfdi:Emisor:Rfc': string;
  'cfdi:Emisor:Nombre': string;
  'cfdi:Receptor:Rfc': string;
  'cfdi:Receptor:Nombre': string;
  'cfdi:Receptor:DomicilioFiscalReceptor': string;
  'cfdi:Receptor:RegimenFiscalReceptor': string;
  'cfdi:Receptor:UsoCFDI': string;
  'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ': string;
  'cfdi:Conceptos:cfdi:Concepto:Cantidad': string;
  'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad': string;
  'cfdi:Conceptos:cfdi:Concepto:Descripcion': string;
  'cfdi:Conceptos:cfdi:Concepto:ObjetoImp': string;
  'cfdi:Conceptos:cfdi:Concepto:ValorUnitario': string;
  'cfdi:Conceptos:cfdi:Concepto:Importe': string;
  'cfdi:Conceptos:cfdi:Concepto:Descuento': string;
  'cfdi:Complemento:nomina12:Nomina:Version': string;
  'cfdi:Complemento:nomina12:Nomina:TipoNomina': string;
  'cfdi:Complemento:nomina12:Nomina:FechaPago': string;
  'cfdi:Complemento:nomina12:Nomina:FechaInicialPago': string;
  'cfdi:Complemento:nomina12:Nomina:FechaFinalPago': string;
  'cfdi:Complemento:nomina12:Nomina:NumDiasPagados': string;
  'cfdi:Complemento:nomina12:Nomina:TotalPercepciones': string;
  'cfdi:Complemento:nomina12:Nomina:TotalDeducciones': string;
  'cfdi:Complemento:nomina12:Nomina:TotalOtrosPagos': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Emisor:RegistroPatronal': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Curp': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumSeguridadSocial': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:FechaInicioRelLaboral': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Antigüedad': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoContrato': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Sindicalizado': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoJornada': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoRegimen': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumEmpleado': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Departamento': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Puesto': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:RiesgoPuesto': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:PeriodicidadPago': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioBaseCotApor': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioDiarioIntegrado': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:ClaveEntFed': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalSueldos': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalGravado': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalExento': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:TipoPercepcion': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Clave': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Concepto': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteGravado': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteExento': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalOtrasDeducciones': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalImpuestosRetenidos': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:TipoDeduccion': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Clave': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Concepto': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Importe': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:TipoDeduccion': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Clave': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Concepto': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Importe': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:TipoOtroPago': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Clave': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Concepto': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Importe': string;
  'cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:nomina12:SubsidioAlEmpleo:SubsidioCausado': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:Version': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:UUID': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT': string;
  'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT': string;
}

var ELEMENT_DATA: Nomina[] = [];
