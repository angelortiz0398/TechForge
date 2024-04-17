import { DropfileDirective, FileHandle } from './../Dropfile.directive';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProgressComponent } from '../progress/progress.component';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import * as xml2js from 'xml2js';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { DialogSelectorColumnComponent } from '../dialog-selector-column/dialog-selector-column.component';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
} from '@angular/material/dialog';
import { Nomina } from '../../entities/Nomina';
import { Egreso } from '../../entities/Egreso';
import { Ingreso } from '../../entities/Ingreso';
import { RecepcionPago } from '../../entities/RecepcionPago';
import { Retenciones } from '../../entities/Retenciones';
import { Traslado } from '../../entities/Traslado';
import { Router, RouterOutlet } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';


interface Columna {
  nombre: string;
  seleccionada: boolean;
}

interface Fila {
  [key: string]: any;
}
@Component({
  selector: 'app-conversor-xml-xlsx',
  standalone: true,
  imports: [
    RouterOutlet,
    ProgressComponent,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    DropfileDirective,
    MatDividerModule,
    MatCardModule,
    DialogSelectorColumnComponent,
    MatIconModule,
    MatPaginatorModule,
    ProgressComponent
  ],
  templateUrl: './conversor-xml-xlsx.component.html',
  styleUrl: './conversor-xml-xlsx.component.css'
})
export class ConversorXmlXlsxComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginatorIngresos!: MatPaginator;
  @ViewChild(MatPaginator) paginatorEgresos!: MatPaginator;
  @ViewChild(MatPaginator) paginatorTraslados!: MatPaginator;
  @ViewChild(MatPaginator) paginatorNominas!: MatPaginator;
  @ViewChild(MatPaginator) paginatorRetenciones!: MatPaginator;
  @ViewChild(MatPaginator) paginatorRecepcionPagos!: MatPaginator;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  ELEMENT_DATA: Nomina[] = [];
  ELEMENT_DATA_EGRESO: Egreso[] = [];
  ELEMENT_DATA_INGRESO: Ingreso[] = [];
  ELEMENT_DATA_NOMINA: Nomina[] = [];
  ELEMENT_DATA_RECEPCION_PAGO: RecepcionPago[] = [];
  ELEMENT_DATA_RETENCION: Retenciones[] = [];
  ELEMENT_DATA_TRASLADO: Traslado[] = [];

  dataSource = new MatTableDataSource<Nomina>(this.ELEMENT_DATA);
  dataSource_Ingreso = new MatTableDataSource<Ingreso>(this.ELEMENT_DATA_INGRESO);
  dataSource_Egreso = new MatTableDataSource<Egreso>(this.ELEMENT_DATA_EGRESO);
  dataSource_Traslado = new MatTableDataSource<Traslado>(this.ELEMENT_DATA_TRASLADO);
  dataSource_Retencion = new MatTableDataSource<Retenciones>(this.ELEMENT_DATA_RETENCION);
  dataSource_Nomina = new MatTableDataSource<Nomina>(this.ELEMENT_DATA_NOMINA);
  dataSource_Recepcion_Pagos = new MatTableDataSource<RecepcionPago>(this.ELEMENT_DATA_RECEPCION_PAGO);
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
  progress : number = 0;
  loading: boolean = false;
  displayedColumnsNomina: string[] = [
    // 'id',
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
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:TipoDeduccion',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Clave',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Concepto',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Importe',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:TipoDeduccion',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Clave',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Concepto',
    // 'cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:1:Importe',
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
  displayedColumnsEgreso: string[] = [
    // 'id',
    'xmlns:cfdi',
    'xmlns:xsi',
    'xsi:schemaLocation',
    'Version',
    'Fecha',
    'Serie',
    'Folio',
    'FormaPago',
    'SubTotal',
    'Moneda',
    'Total',
    'TipoDeComprobante',
    'MetodoPago',
    'LugarExpedicion',
    'Exportacion',
    'Certificado',
    'NoCertificado',
    'Sello',
    'cfdi:CfdiRelacionados:TipoRelacion',
    'cfdi:CfdiRelacionados:cfdi:CfdiRelacionado:UUID',
    'cfdi:Emisor:Rfc',
    'cfdi:Emisor:Nombre',
    'cfdi:Emisor:RegimenFiscal',
    'cfdi:Receptor:Rfc',
    'cfdi:Receptor:Nombre',
    'cfdi:Receptor:DomicilioFiscalReceptor',
    'cfdi:Receptor:RegimenFiscalReceptor',
    'cfdi:Receptor:UsoCFDI',
    'cfdi:Conceptos:cfdi:Concepto:Cantidad',
    'cfdi:Conceptos:cfdi:Concepto:Unidad',
    'cfdi:Conceptos:cfdi:Concepto:NoIdentificacion',
    'cfdi:Conceptos:cfdi:Concepto:Descripcion',
    'cfdi:Conceptos:cfdi:Concepto:ValorUnitario',
    'cfdi:Conceptos:cfdi:Concepto:Importe',
    'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ',
    'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad',
    'cfdi:Conceptos:cfdi:Concepto:ObjetoImp',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe',
    'cfdi:Impuestos:TotalImpuestosTrasladados',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor'
  ];
  displayedColumnsIngreso: string[] = [
    // 'id',
    'xmlns:cfdi',
    'xmlns:xsi',
    'xsi:schemaLocation',
    'Version',
    'Serie',
    'Folio',
    'Fecha',
    'FormaPago',
    'CondicionesDePago',
    'SubTotal',
    'Moneda',
    'Total',
    'TipoDeComprobante',
    'MetodoPago',
    'LugarExpedicion',
    'Exportacion',
    'Certificado',
    'NoCertificado',
    'Sello',
    'cfdi:InformacionGlobal:Periodicidad',
    'cfdi:InformacionGlobal:Meses',
    'cfdi:InformacionGlobal:Año',
    'cfdi:Emisor:Rfc',
    'cfdi:Emisor:Nombre',
    'cfdi:Emisor:RegimenFiscal',
    'cfdi:Receptor:Rfc',
    'cfdi:Receptor:Nombre',
    'cfdi:Receptor:DomicilioFiscalReceptor',
    'cfdi:Receptor:RegimenFiscalReceptor',
    'cfdi:Receptor:UsoCFDI',
    'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ',
    'cfdi:Conceptos:cfdi:Concepto:Cantidad',
    'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad',
    'cfdi:Conceptos:cfdi:Concepto:Unidad',
    'cfdi:Conceptos:cfdi:Concepto:Descripcion',
    'cfdi:Conceptos:cfdi:Concepto:ValorUnitario',
    'cfdi:Conceptos:cfdi:Concepto:Importe',
    'cfdi:Conceptos:cfdi:Concepto:ObjetoImp',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota',
    'cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe',
    'cfdi:Impuestos:TotalImpuestosTrasladados',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota',
    'cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:Version',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:UUID',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT'
  ];
  displayedColumnsRecepcionPago: string[] = [
    // 'id',
    'xsi:schemaLocation',
    'Version',
    'Serie',
    'Folio',
    'Fecha',
    'NoCertificado',
    'SubTotal',
    'Moneda',
    'Total',
    'LugarExpedicion',
    'TipoDeComprobante',
    'Exportacion',
    'Certificado',
    'Sello',
    'xmlns:cfdi',
    'xmlns:pago20',
    'xmlns:xsi',
    'cfdi:Emisor:Rfc',
    'cfdi:Emisor:Nombre',
    'cfdi:Emisor:RegimenFiscal',
    'cfdi:Receptor:Rfc',
    'cfdi:Receptor:Nombre',
    'cfdi:Receptor:UsoCFDI',
    'cfdi:Receptor:DomicilioFiscalReceptor',
    'cfdi:Receptor:RegimenFiscalReceptor',
    'cfdi:Conceptos:cfdi:Concepto:Cantidad',
    'cfdi:Conceptos:cfdi:Concepto:ValorUnitario',
    'cfdi:Conceptos:cfdi:Concepto:Importe',
    'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad',
    'cfdi:Conceptos:cfdi:Concepto:Descripcion',
    'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ',
    'cfdi:Conceptos:cfdi:Concepto:ObjetoImp',
    'cfdi:Complemento:pago20:Pagos:Version',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalRetencionesIVA',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalRetencionesISR',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalRetencionesIEPS',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVA16',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosImpuestoIVA16',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVA8',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosImpuestoIVA8',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVA0',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosImpuestoIVA0',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVAExento',
    'cfdi:Complemento:pago20:Pagos:pago20:Totales:MontoTotalPagos',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:FechaPago',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:FormaDePagoP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:MonedaP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:TipoCambioP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:Monto',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:NumOperacion',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:NomBancoOrdExt',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:IdDocumento',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:Serie',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:Folio',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:MonedaDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:NumParcialidad',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ImpSaldoAnt',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ImpPagado',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ImpSaldoInsoluto',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ObjetoImpDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:EquivalenciaDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:BaseDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:ImpuestoDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:TipoFactorDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:TasaOCuotaDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:ImporteDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:BaseDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:ImpuestoDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:TipoFactorDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:TasaOCuotaDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:ImporteDR',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:RetencionesP:pago20:RetencionP:ImpuestoP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:RetencionesP:pago20:RetencionP:ImporteP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:BaseP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:ImpuestoP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:TipoFactorP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:TasaOCuotaP',
    'cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:ImporteP',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:Version',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:UUID',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd',
    'cfdi:Addenda:if:DocumentoInterfactura:xmlns:if',
    'cfdi:Addenda:if:DocumentoInterfactura:xmlns:xsi',
    'cfdi:Addenda:if:DocumentoInterfactura:xsi:schemaLocation',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Emisor:nombre',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Emisor:RFC',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:RFC',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:nombre',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:cfdiRegimenFiscalReceptor',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:domicilioFiscalReceptor',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:codigoPostal',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:colonia',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:municipio',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:pais',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:ResidenciaFiscal',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:SubTotal',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Total',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Moneda',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:TipoDocumento',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:LugarExpedicion',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:RegimenFiscalEmisor',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:cfdiUsoCFDI',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:FolioReferencia',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Serie',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Receptor_Email',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Receptor_Domicilio_CodigoPostal',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Folio',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:cfdiExportacion',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Version',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:AsuntoCorreo',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:RulesApplied',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:cadenaOriginal',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Renglon',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Cantidad',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:cfdiClaveProdServ',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:cfdiClaveUnidad',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Concepto',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:PUnitario',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Importe',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:cfdiObjetoImp',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalRetencionesIVA',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalRetencionesISR',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalRetencionesIEPS',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVA16',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosImpuestoIVA16',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVA8',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosImpuestoIVA8',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVA0',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosImpuestoIVA0',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVAExento',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:MontoTotalPagos',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoFechaPago',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoFormaDePagoP',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoMonedaP',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoTipoCambioP',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoMonto',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoNumOperacion',
    'cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoNomBancoOrdExt'
  ];
  displayedColumnsTraslado: string[] = [
    // 'id',
    'xmlns:cfdi',
    'xmlns:xsi',
    'xsi:schemaLocation',
    'Version',
    'Fecha',
    'Serie',
    'Folio',
    'SubTotal',
    'Moneda',
    'Total',
    'TipoDeComprobante',
    'LugarExpedicion',
    'Exportacion',
    'Certificado',
    'NoCertificado',
    'Sello',
    'cfdi:Emisor:Rfc',
    'cfdi:Emisor:Nombre',
    'cfdi:Emisor:RegimenFiscal',
    'cfdi:Receptor:Rfc',
    'cfdi:Receptor:Nombre',
    'cfdi:Receptor:DomicilioFiscalReceptor',
    'cfdi:Receptor:RegimenFiscalReceptor',
    'cfdi:Receptor:UsoCFDI',
    'cfdi:Conceptos:cfdi:Concepto:Cantidad',
    'cfdi:Conceptos:cfdi:Concepto:Unidad',
    'cfdi:Conceptos:cfdi:Concepto:NoIdentificacion',
    'cfdi:Conceptos:cfdi:Concepto:Descripcion',
    'cfdi:Conceptos:cfdi:Concepto:ValorUnitario',
    'cfdi:Conceptos:cfdi:Concepto:Importe',
    'cfdi:Conceptos:cfdi:Concepto:ClaveProdServ',
    'cfdi:Conceptos:cfdi:Concepto:ClaveUnidad',
    'cfdi:Conceptos:cfdi:Concepto:ObjetoImp',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:Version',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:UUID',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT',
    'cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT'
  ];
  displayedColumnsRetencion: string[] = [
    // 'id',
    'xmlns:retenciones',
    'xmlns:xsi',
    'xmlns:plataformasTecnologicas',
    'xsi:schemaLocation',
    'Version',
    'FolioInt',
    'FechaExp',
    'CveRetenc',
    'LugarExpRetenc',
    'Certificado',
    'NoCertificado',
    'Sello',
    'retenciones:Emisor:RfcE',
    'retenciones:Emisor:NomDenRazSocE',
    'retenciones:Emisor:RegimenFiscalE',
    'retenciones:Receptor:NacionalidadR',
    'retenciones:Receptor:retenciones:Nacional:RfcR',
    'retenciones:Receptor:retenciones:Nacional:NomDenRazSocR',
    'retenciones:Receptor:retenciones:Nacional:DomicilioFiscalR',
    'retenciones:Periodo:MesIni',
    'retenciones:Periodo:MesFin',
    'retenciones:Periodo:Ejercicio',
    'retenciones:Totales:MontoTotOperacion',
    'retenciones:Totales:MontoTotGrav',
    'retenciones:Totales:MontoTotExent',
    'retenciones:Totales:MontoTotRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:0:BaseRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:0:ImpuestoRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:0:MontoRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:0:TipoPagoRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:1:BaseRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:1:ImpuestoRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:1:MontoRet',
    // 'retenciones:Totales:retenciones:ImpRetenidos:1:TipoPagoRet',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:Version',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:Periodicidad',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:NumServ',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:MonTotServSIVA',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalIVATrasladado',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalIVARetenido',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalISRRetenido',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:DifIVAEntregadoPrestServ',
    'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:MonTotalporUsoPlataforma',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:FormaPagoServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:TipoDeServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:SubTipServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:FechaServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:PrecioServSinIVA',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Base',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Impuesto',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:TipoFactor',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:TasaCuota',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Importe',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ComisionDelServicio:Importe',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:FormaPagoServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:TipoDeServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:SubTipServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:FechaServ',
    // 'retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:PrecioServSinIVA',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:Version',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:SelloCFD',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:UUID',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado',
    'retenciones:Complemento:tfd:TimbreFiscalDigital:SelloSAT'
  ];
  displayedColumnsNominaSelected: string[] = this.displayedColumnsNomina;
  displayedColumnsEgresoSelected: string[] = this.displayedColumnsEgreso;
  displayedColumnsIngresoSelected: string[] = this.displayedColumnsIngreso;
  displayedColumnsRecepcionPagoSelected: string[] = this.displayedColumnsRecepcionPago;
  displayedColumnsTrasladoSelected: string[] = this.displayedColumnsTraslado;
  displayedColumnsRetencionSelected: string[] = this.displayedColumnsRetencion;

  constructor(public dialog: MatDialog, private router: Router) {}

  ngBeforeViewInit(){
    this.displayedColumnsNominaSelected = this.displayedColumnsNomina;

  }

  ngAfterViewInit() {
    this.displayedColumnsNominaSelected = this.displayedColumnsNomina;
    this.displayedColumnsEgresoSelected = this.displayedColumnsEgreso;
    this.displayedColumnsIngresoSelected = this.displayedColumnsIngreso;
    this.displayedColumnsRecepcionPagoSelected = this.displayedColumnsRecepcionPago;
    this.displayedColumnsTrasladoSelected = this.displayedColumnsTraslado;
    this.displayedColumnsRetencionSelected = this.displayedColumnsRetencion;
    this.dataSource_Ingreso.paginator = this.paginatorIngresos;
    this.dataSource_Egreso.paginator = this.paginatorEgresos;
    this.dataSource.paginator = this.paginatorNominas;
    this.dataSource_Recepcion_Pagos.paginator = this.paginatorRecepcionPagos;
    this.dataSource_Retencion.paginator = this.paginatorRetenciones;
    this.dataSource_Traslado.paginator = this.paginatorTraslados;
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
    location.reload();
  }

  CargarArchivos(event: any): void {
    this.loading = true;
    const url: SafeUrl = '';
    // Agrega los archivos fisicos a una lista de FileHandle
    for (const archivo of event.target.files) {
      const fileHandle: FileHandle = { file: archivo, url: url };
      this.files.push(fileHandle);
    }
    const filesArray: File[] = Array.from(event.target.files); // Convertir FileList a Array
    this.processFiles(filesArray);
    setTimeout(() => {
      this.paginarTablas();
    },1000);
  }

  processFiles(files: File[]): void {
    // Procesar los archivos por lotes
    const batchSize = 1; // Puedes ajustar este valor según tus necesidades
    let index = 0;
    const processBatch = async (): Promise<void> => {
      const batchFiles = files.slice(index, index + batchSize);
      if (batchFiles.length > 0) {
        for (const archivo of batchFiles) {
          const contenido: string = await new Promise<string>((resolve, reject) => {
            const lector: FileReader = new FileReader();
            lector.onload = (e) => {
              resolve(e.target!.result as string);
            };
            lector.onerror = (e) => {
              reject(e.target!.error);
            };
            lector.readAsText(archivo);
          });
          this.bodyXML += `\n====== ${archivo.name}======\n`;
          this.bodyXML += contenido;
          const parser = new xml2js.Parser({
            explicitArray: false,
            mergeAttrs: true,
          });
          const resultado = await new Promise<any>((resolve, reject) => {
            parser.parseString(contenido, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
          });
          this.procesarDatos(resultado);
          this.progress = ((index + batchFiles.length) / files.length) * 100;
        }
        index += batchSize;
        await new Promise((resolve) => setTimeout(resolve, 100)); // Procesar el próximo lote en el siguiente ciclo de eventos
        await processBatch();
      } else {
        // Todos los archivos han sido procesados
        this.loading = false;
        // Actualizar paginadores u otras operaciones después de la carga de archivos
      }
    };

    processBatch();
  }




  paginarTablas(): void {
    if(this.ELEMENT_DATA_INGRESO.length > 0){
      this.dataSource_Ingreso.data = this.ELEMENT_DATA_INGRESO.slice(0,5);
      // this.paginatorIngresos.length = this.ELEMENT_DATA_INGRESO.length;
      // this.displayedColumnsIngresoSelected.pop();
      // this.displayedColumnsIngresoSelected = this.displayedColumnsIngreso;
      // console.info("this.ELEMENT_DATA_INGRESO: ", this.ELEMENT_DATA_INGRESO)
    }
    if(this.ELEMENT_DATA_EGRESO.length > 0){

      this.dataSource_Egreso.data = this.ELEMENT_DATA_EGRESO.slice(0,5);
      // this.paginatorEgresos.length = this.ELEMENT_DATA_EGRESO.length;
      // this.displayedColumnsEgresoSelected.pop();
      // this.displayedColumnsEgresoSelected = this.displayedColumnsEgreso;
    }
    if(this.ELEMENT_DATA_TRASLADO.length > 0){
      this.dataSource_Traslado.data = this.ELEMENT_DATA_TRASLADO.slice(0, 5);
      // this.paginatorTraslados.length = this.ELEMENT_DATA_TRASLADO.length;
      // this.displayedColumnsTrasladoSelected.pop();
      // this.displayedColumnsTrasladoSelected = this.displayedColumnsTraslado;
    }

    if(this.ELEMENT_DATA.length > 0){
      this.dataSource.data = this.ELEMENT_DATA.slice(0, 5);
      // this.paginatorNominas.length = this.ELEMENT_DATA_NOMINA.length;
      // this.displayedColumnsNominaSelected.pop();
      // this.displayedColumnsNominaSelected = this.displayedColumnsNomina;
    }

    if(this.ELEMENT_DATA_RECEPCION_PAGO.length > 0){
      this.dataSource_Recepcion_Pagos.data = this.ELEMENT_DATA_RECEPCION_PAGO.slice(0, 5);
      // this.paginatorRecepcionPagos.length = this.ELEMENT_DATA_RECEPCION_PAGO.length;
      // this.displayedColumnsRecepcionPagoSelected.pop();
      // this.displayedColumnsRecepcionPagoSelected = this.displayedColumnsRecepcionPago;
    }

    if(this.ELEMENT_DATA_RETENCION.length > 0){
      this.dataSource_Retencion.data = this.ELEMENT_DATA_RETENCION.slice(0, 5);
      // this.paginatorRetenciones.length = this.ELEMENT_DATA_RETENCION.length;
      // this.displayedColumnsRetencionSelected.pop();
      // this.displayedColumnsRetencionSelected = this.displayedColumnsRetencion;
    }

  }

  procesarDatos(datosXML: any): void {
    // Limpiar las columnas existentes
    this.columnas = [];
    this.datos = [];
    var tipoDocumento = '';
    var propiedadPadre = '';
    if(datosXML['cfdi:Comprobante'] != undefined)
    {
      propiedadPadre = 'cfdi:Comprobante';
      tipoDocumento = datosXML['cfdi:Comprobante']['TipoDeComprobante']
    }
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
                let temp1 = datosXML[propiedadPadre];
                for (let i = 0; i < 1; i++) {
                  if (temp1[subcadenas[i]]) {
                    temp1 = temp1[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp1 = undefined;
                    break;
                  }
                }
                if (temp1 !== undefined) {
                  fila[columna.nombre] = temp1;
                }
                break;
              case 2:
                let temp2 = datosXML[propiedadPadre];
                for (let i = 0; i < 2; i++) {
                  if (temp2[subcadenas[i]]) {
                    temp2 = temp2[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp2 = undefined;
                    break;
                  }
                }
                if (temp2 !== undefined) {
                  fila[columna.nombre] = temp2;
                }
                break;
              case 3:
                let temp3 = datosXML[propiedadPadre];
                for (let i = 0; i < 3; i++) {
                  if (temp3[subcadenas[i]]) {
                    temp3 = temp3[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp3 = undefined;
                    break;
                  }
                }
                if (temp3 !== undefined) {
                  fila[columna.nombre] = temp3;
                }
                break;
              case 4:
                let temp4 = datosXML[propiedadPadre];
                for (let i = 0; i < 4; i++) {
                  if (temp4[subcadenas[i]]) {
                    temp4 = temp4[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp4 = undefined;
                    break;
                  }
                }
                if (temp4 !== undefined) {
                  fila[columna.nombre] = temp4;
                }
                break;
              case 5:
                let temp5 = datosXML[propiedadPadre];
                for (let i = 0; i < 5; i++) {
                  if (temp5[subcadenas[i]]) {
                    temp5 = temp5[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp5 = undefined;
                    break;
                  }
                }
                if (temp5 !== undefined) {
                  fila[columna.nombre] = temp5;
                }
                break;
                case 6:
                  let temp = datosXML[propiedadPadre];
                  for (let i = 0; i < 6; i++) {
                    if (temp[subcadenas[i]]) {
                      temp = temp[subcadenas[i]];
                    } else {
                      // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                      temp = undefined;
                      break;
                    }
                  }
                  if (temp !== undefined) {
                    fila[columna.nombre] = temp;
                  }
                  break;
              case 7:
                let temp7 = datosXML[propiedadPadre];
                for (let i = 0; i < 7; i++) {
                  if (temp7[subcadenas[i]]) {
                    temp7 = temp7[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp7 = undefined;
                    break;
                  }
                }
                if (temp7 !== undefined) {
                  fila[columna.nombre] = temp7;
                }
                break;
              case 8:
                let temp8 = datosXML[propiedadPadre];
                for (let i = 0; i < 8; i++) {
                  if (temp8[subcadenas[i]]) {
                    temp8 = temp8[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp8 = undefined;
                    break;
                  }
                }
                if (temp8 !== undefined) {
                  fila[columna.nombre] = temp8;
                }
                break;
              case 9:
                let temp9 = datosXML[propiedadPadre];
                for (let i = 0; i < 9; i++) {
                  if (temp9[subcadenas[i]]) {
                    temp9 = temp9[subcadenas[i]];
                  } else {
                    // Si una de las propiedades intermedias no existe, asignamos undefined y salimos del bucle
                    temp9 = undefined;
                    break;
                  }
                }
                if (temp9 !== undefined) {
                  fila[columna.nombre] = temp9;
                }
                break;
            }
          }
        }
        this.datos.push(fila);
      }
    }
    // console.log('columnas: ', this.columnas);
    // console.log('datos: ', this.datos);

    this.datos.forEach((dato) => {
      // console.log("propiedadPadre: ", propiedadPadre)
      // console.log("tipoDocumento: ", tipoDocumento)
      if(propiedadPadre == 'cfdi:Comprobante')
      {
        switch(tipoDocumento)
        {
          // Recepcion de pago
          case 'P':
            var objetoRecepcionPago: RecepcionPago = {
              id: this.generarIdUnico(),
              'xsi:schemaLocation': dato['xsi:schemaLocation'],
              Version: dato['Version'],
              Serie: dato['Serie'],
              Folio: dato['Folio'],
              Fecha: dato['Fecha'],
              NoCertificado: dato['NoCertificado'],
              SubTotal: dato['SubTotal'],
              Moneda: dato['Moneda'],
              Total: dato['Total'],
              LugarExpedicion: dato['LugarExpedicion'],
              TipoDeComprobante: dato['TipoDeComprobante'],
              Exportacion: dato['Exportacion'],
              Certificado: dato['Certificado'],
              Sello: dato['Sello'],
              "xmlns:cfdi": dato['xmlns:cfdi'],
              "xmlns:pago20": dato['xmlns:pago20'],
              "xmlns:xsi": dato['xmlns:xsi'],
              "cfdi:Emisor": {
                  Rfc: dato["cfdi:Emisor:Rfc"],
                  Nombre: dato["cfdi:Emisor:Nombre"],
                  RegimenFiscal: dato["cfdi:Emisor:RegimenFiscal"]
              },
              "cfdi:Receptor": {
                  Rfc: dato["cfdi:Receptor:Rfc"],
                  Nombre: dato["cfdi:Receptor:Nombre"],
                  UsoCFDI: dato["cfdi:Receptor:UsoCFDI"],
                  DomicilioFiscalReceptor: dato["cfdi:Receptor:DomicilioFiscalReceptor"],
                  RegimenFiscalReceptor: dato["cfdi:Receptor:RegimenFiscalReceptor"]
              },
              "cfdi:Conceptos": {
                  "cfdi:Concepto": {
                      Cantidad: dato['cfdi:Conceptos:cfdi:Concepto:Cantidad'],
                      ValorUnitario: dato['cfdi:Conceptos:cfdi:Concepto:ValorUnitario'],
                      Importe: dato['cfdi:Conceptos:cfdi:Concepto:Importe'],
                      ClaveUnidad: dato['cfdi:Conceptos:cfdi:Concepto:ClaveUnidad'],
                      Descripcion: dato['cfdi:Conceptos:cfdi:Concepto:Descripcion'],
                      ClaveProdServ: dato['cfdi:Conceptos:cfdi:Concepto:ClaveProdServ'],
                      ObjetoImp: dato['cfdi:Conceptos:cfdi:Concepto:ObjetoImp']
                  }
              },
              "cfdi:Complemento": {
                  "pago20:Pagos": {
                      Version: dato['cfdi:Complemento:pago20:Pagos:Version'],
                      "pago20:Totales": {
                          TotalRetencionesIVA: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalRetencionesIVA'],
                          TotalRetencionesISR: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalRetencionesISR'],
                          TotalRetencionesIEPS: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalRetencionesIEPS'],
                          TotalTrasladosBaseIVA16: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVA16'],
                          TotalTrasladosImpuestoIVA16: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosImpuestoIVA16'],
                          TotalTrasladosBaseIVA8: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVA8'],
                          TotalTrasladosImpuestoIVA8: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosImpuestoIVA8'],
                          TotalTrasladosBaseIVA0: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVA0'],
                          TotalTrasladosImpuestoIVA0: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosImpuestoIVA0'],
                          TotalTrasladosBaseIVAExento: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:TotalTrasladosBaseIVAExento'],
                          MontoTotalPagos: dato['cfdi:Complemento:pago20:Pagos:pago20:Totales:MontoTotalPagos']
                      },
                      "pago20:Pago": {
                          FechaPago: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:FechaPago'],
                          FormaDePagoP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:FormaDePagoP'],
                          MonedaP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:MonedaP'],
                          TipoCambioP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:TipoCambioP'],
                          Monto: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:Monto'],
                          NumOperacion: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:NumOperacion'],
                          NomBancoOrdExt: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:NomBancoOrdExt'],
                          "pago20:DoctoRelacionado": {
                              IdDocumento: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:IdDocumento'],
                              Serie: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:Serie'],
                              Folio: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:Folio'],
                              MonedaDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:MonedaDR'],
                              NumParcialidad: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:NumParcialidad'],
                              ImpSaldoAnt: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ImpSaldoAnt'],
                              ImpPagado: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ImpPagado'],
                              ImpSaldoInsoluto: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ImpSaldoInsoluto'],
                              ObjetoImpDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:ObjetoImpDR'],
                              EquivalenciaDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:EquivalenciaDR'],
                              "pago20:ImpuestosDR": {
                                "pago20:RetencionesDR": {
                                  "pago20:RetencionDR": {
                                    BaseDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:BaseDR'],
                                    ImpuestoDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:ImpuestoDR'],
                                    TipoFactorDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:TipoFactorDR'],
                                    TasaOCuotaDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:TasaOCuotaDR'],
                                    ImporteDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:RetencionesDR:pago20:RetencionDR:ImporteDR'],
                                  }
                                },
                                "pago20:TrasladosDR": {
                                  "pago20:TrasladoDR":{
                                    BaseDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:BaseDR'],
                                    ImpuestoDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:ImpuestoDR'],
                                    TipoFactorDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:TipoFactorDR'],
                                    TasaOCuotaDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:TasaOCuotaDR'],
                                    ImporteDR: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:DoctoRelacionado:pago20:ImpuestosDR:pago20:TrasladosDR:pago20:TrasladoDR:ImporteDR']
                                  }
                                }
                              }
                          },
                          "pago20:ImpuestosP" : {
                            "pago20:RetencionesP": {
                              "pago20:RetencionP":{
                                ImpuestoP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:RetencionesP:pago20:RetencionP:ImpuestoP'],
                                ImporteP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:RetencionesP:pago20:RetencionP:ImporteP'],
                              }
                            },
                            "pago20:TrasladosP": {
                              "pago20:TrasladoP": {
                                BaseP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:BaseP'],
                                ImpuestoP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:ImpuestoP'],
                                TipoFactorP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:TipoFactorP'],
                                TasaOCuotaP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:TasaOCuotaP'],
                                ImporteP: dato['cfdi:Complemento:pago20:Pagos:pago20:Pago:pago20:ImpuestosP:pago20:TrasladosP:pago20:TrasladoP:ImporteP'],
                              }
                            }
                          }
                        }
                      },
                  "tfd:TimbreFiscalDigital": {
                    Version: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:Version'],
                    UUID: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:UUID'],
                    FechaTimbrado: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
                    RfcProvCertif: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
                    SelloCFD: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
                    NoCertificadoSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
                    SelloSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT'],
                    "xsi:schemaLocation": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
                    "xmlns:tfd": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:xmlns:tfd']
                  }},
              "cfdi:Addenda":{
                "if:DocumentoInterfactura" : {
                  "xmlns:if": dato['cfdi:Addenda:if:DocumentoInterfactura:xmlns:if'],
                  "xmlns:xsi": dato['cfdi:Addenda:if:DocumentoInterfactura:xmlns:xsi'],
                  "xsi:schemaLocation": dato['cfdi:Addenda:if:DocumentoInterfactura:xsi:schemaLocation'],
                  "if:Emisor": {
                    nombre: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Emisor:nombre'],
                    RFC: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Emisor:RFC']
                  },
                  "if:Receptor": {
                    RFC: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:RFC'],
                    nombre: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:nombre'],
                    cfdiRegimenFiscalReceptor: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:cfdiRegimenFiscalReceptor'],
                    domicilioFiscalReceptor: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:domicilioFiscalReceptor'],
                    "if:Domicilio": {
                      codigoPostal: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:codigoPostal'],
                      colonia: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:colonia'],
                      municipio: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:municipio'],
                      pais: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Receptor:if:Domicilio:pais'],
                    }
                  },
                  "if:Encabezado": {
                    ResidenciaFiscal: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:ResidenciaFiscal'],
                    SubTotal: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:SubTotal'],
                    Total: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Total'],
                    Moneda: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Moneda'],
                    TipoDocumento: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:TipoDocumento'],
                    LugarExpedicion: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:LugarExpedicion'],
                    RegimenFiscalEmisor: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:RegimenFiscalEmisor'],
                    cfdiUsoCFDI: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:cfdiUsoCFDI'],
                    FolioReferencia: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:FolioReferencia'],
                    Serie: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Serie'],
                    Receptor_Email: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Receptor_Email'],
                    Receptor_Domicilio_CodigoPostal: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Receptor_Domicilio_CodigoPostal'],
                    Folio: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Folio'],
                    cfdiExportacion: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:cfdiExportacion'],
                    Version: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:Version'],
                    AsuntoCorreo: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:AsuntoCorreo'],
                    RulesApplied: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:RulesApplied'],
                    cadenaOriginal: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:cadenaOriginal'],
                    "if:Cuerpo": {
                      Renglon: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Renglon'],
                      Cantidad: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Cantidad'],
                      cfdiClaveProdServ: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:cfdiClaveProdServ'],
                      cfdiClaveUnidad: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:cfdiClaveUnidad'],
                      Concepto: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Concepto'],
                      PUnitario: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:PUnitario'],
                      Importe: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:Importe'],
                      cfdiObjetoImp: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Cuerpo:cfdiObjetoImp'],
                    },
                    "if:Pagos": {
                      TotalRetencionesIVA: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalRetencionesIVA'],
                      TotalRetencionesISR: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalRetencionesISR'],
                      TotalRetencionesIEPS: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalRetencionesIEPS'],
                      TotalTrasladosBaseIVA16: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVA16'],
                      TotalTrasladosImpuestoIVA16: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosImpuestoIVA16'],
                      TotalTrasladosBaseIVA8: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVA8'],
                      TotalTrasladosImpuestoIVA8: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosImpuestoIVA8'],
                      TotalTrasladosBaseIVA0: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVA0'],
                      TotalTrasladosImpuestoIVA0: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosImpuestoIVA0'],
                      TotalTrasladosBaseIVAExento: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:TotalTrasladosBaseIVAExento'],
                      MontoTotalPagos: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:MontoTotalPagos'],
                      "if:pago20Pago": {
                        pagoFechaPago: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoFechaPago'],
                        pagoFormaDePagoP: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoFormaDePagoP'],
                        pagoMonedaP: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoMonedaP'],
                        pagoTipoCambioP: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoTipoCambioP'],
                        pagoMonto: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoMonto'],
                        pagoNumOperacion: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoNumOperacion'],
                        pagoNomBancoOrdExt: dato['cfdi:Addenda:if:DocumentoInterfactura:if:Encabezado:if:Pagos:if:pago20Pago:pagoNomBancoOrdExt'],
                      }
                    }
                  }
                }
              }
                  };
            this.ELEMENT_DATA_RECEPCION_PAGO.push(objetoRecepcionPago);
            this.displayedColumnsRecepcionPagoSelected.pop();
            this.displayedColumnsRecepcionPagoSelected = this.displayedColumnsRecepcionPago;
            break;
          // Egreso
          case 'E':
            // Asignacion en la tabla de Egresos
            var objetoEgresos: Egreso = {
              id: this.generarIdUnico(),
              'xmlns:cfdi': dato['xmlns:cfdi'],
              'xmlns:xsi': dato['xmlns:xsi'],
              'xsi:schemaLocation': dato['xsi:schemaLocation'],
              Version: dato['Version'],
              Fecha: dato['Fecha'],
              Serie: dato['Serie'],
              Folio: dato['Folio'],
              FormaPago: dato['FormaPago'],
              SubTotal: dato['SubTotal'],
              Moneda: dato['Moneda'],
              Total: dato['Total'],
              TipoDeComprobante: dato['TipoDeComprobante'],
              MetodoPago: dato['MetodoPago'],
              LugarExpedicion: dato['LugarExpedicion'],
              Exportacion: dato['Exportacion'],
              Certificado: dato['Certificado'],
              NoCertificado: dato['NoCertificado'],
              Sello: dato['Sello'],
              "cfdi:CfdiRelacionados": {
                  TipoRelacion: dato['cfdi:CfdiRelacionados:TipoRelacion'],
                  "cfdi:CfdiRelacionado": {
                      UUID: dato['cfdi:CfdiRelacionados:cfdi:CfdiRelacionado:UUID']
                  }
              },
              "cfdi:Emisor": {
                  Rfc: dato['cfdi:Emisor:Rfc'],
                  Nombre: dato['cfdi:Emisor:Nombre'],
                  RegimenFiscal: dato['cfdi:Emisor:RegimenFiscal']
              },
              "cfdi:Receptor": {
                  Rfc: dato['cfdi:Receptor:Rfc'],
                  Nombre: dato['cfdi:Receptor:Nombre'],
                  DomicilioFiscalReceptor: dato['cfdi:Receptor:DomicilioFiscalReceptor'],
                  RegimenFiscalReceptor: dato['cfdi:Receptor:RegimenFiscalReceptor'],
                  UsoCFDI: dato['cfdi:Receptor:UsoCFDI']
              },
              "cfdi:Conceptos": {
                  "cfdi:Concepto": {
                      Cantidad: dato['cfdi:Conceptos:cfdi:Concepto:Cantidad'],
                      Unidad: dato['cfdi:Conceptos:cfdi:Concepto:Unidad'],
                      NoIdentificacion: dato['cfdi:Conceptos:cfdi:Concepto:NoIdentificacion'],
                      Descripcion: dato['cfdi:Conceptos:cfdi:Concepto:Descripcion'],
                      ValorUnitario: dato['cfdi:Conceptos:cfdi:Concepto:ValorUnitario'],
                      Importe: dato['cfdi:Conceptos:cfdi:Concepto:Importe'],
                      ClaveProdServ: dato['cfdi:Conceptos:cfdi:Concepto:ClaveProdServ'],
                      ClaveUnidad: dato['cfdi:Conceptos:cfdi:Concepto:ClaveUnidad'],
                      ObjetoImp: dato['cfdi:Conceptos:cfdi:Concepto:ObjetoImp'],
                      "cfdi:Impuestos": {
                          "cfdi:Traslados": {
                              "cfdi:Traslado": {
                                  Base: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base'],
                                  Impuesto: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto'],
                                  TipoFactor: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor'],
                                  TasaOCuota: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota'],
                                  Importe: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe']
                              }
                          }
                      }
                  }
              },
              "cfdi:Impuestos": {
                  TotalImpuestosTrasladados: dato['cfdi:Impuestos:TotalImpuestosTrasladados'],
                  "cfdi:Traslados": {
                      "cfdi:Traslado": {
                          Base: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base'],
                          Impuesto: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto'],
                          Importe: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe'],
                          TasaOCuota: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota'],
                          TipoFactor: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor']
                      }
                  }
              }
            };
            this.ELEMENT_DATA_EGRESO.push(objetoEgresos);
            this.displayedColumnsEgresoSelected.pop();
            this.displayedColumnsEgresoSelected = this.displayedColumnsEgreso;
            break;
          // Traslado
          case 'T':
            // Asignacion en la tabla de Traslados
            var objTraslado: Traslado = {
              id: this.generarIdUnico(),
              'xmlns:cfdi': dato['xmlns:cfdi'],
              'xmlns:xsi': dato['xmlns:xsi'],
              'xsi:schemaLocation': dato['xsi:schemaLocation'],
              Version: dato['Version'],
              Fecha: dato['Fecha'],
              Serie: dato['Serie'],
              Folio: dato['Folio'],
              SubTotal: dato['SubTotal'],
              Moneda: dato['Moneda'],
              Total: dato['Total'],
              TipoDeComprobante: dato['TipoDeComprobante'],
              LugarExpedicion: dato['LugarExpedicion'],
              Exportacion: dato['Exportacion'],
              Certificado: dato['Certificado'],
              NoCertificado: dato['NoCertificado'],
              Sello: dato['Sello'],
              "cfdi:Emisor": {
                  Rfc: dato["cfdi:Emisor:Rfc"],
                  Nombre: dato["cfdi:Emisor:Nombre"],
                  RegimenFiscal: dato["cfdi:Emisor:RegimenFiscal"]
              },
              "cfdi:Receptor": {
                  Rfc: dato["cfdi:Receptor:Rfc"],
                  Nombre: dato["cfdi:Receptor:Nombre"],
                  DomicilioFiscalReceptor: dato["cfdi:Receptor:DomicilioFiscalReceptor"],
                  RegimenFiscalReceptor: dato["cfdi:Receptor:RegimenFiscalReceptor"],
                  UsoCFDI: dato["cfdi:Receptor:UsoCFDI"]
              },
              "cfdi:Conceptos": {
                  "cfdi:Concepto": {
                      Cantidad: dato['cfdi:Conceptos:cfdi:Concepto:Cantidad'],
                      Unidad: dato['cfdi:Conceptos:cfdi:Concepto:Unidad'],
                      NoIdentificacion: dato['cfdi:Conceptos:cfdi:Concepto:NoIdentificacion'],
                      Descripcion: dato['cfdi:Conceptos:cfdi:Concepto:Descripcion'],
                      ValorUnitario: dato['cfdi:Conceptos:cfdi:Concepto:ValorUnitario'],
                      Importe: dato['cfdi:Conceptos:cfdi:Concepto:Importe'],
                      ClaveProdServ: dato['cfdi:Conceptos:cfdi:Concepto:ClaveProdServ'],
                      ClaveUnidad: dato['cfdi:Conceptos:cfdi:Concepto:ClaveUnidad'],
                      ObjetoImp: dato['cfdi:Conceptos:cfdi:Concepto:ObjetoImp']
                  }
              },
              "cfdi:Complemento": {
                  "tfd:TimbreFiscalDigital": {
                      "xmlns:tfd": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd'],
                      "xsi:schemaLocation": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
                      Version: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:Version'],
                      UUID: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:UUID'],
                      FechaTimbrado: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
                      RfcProvCertif: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
                      SelloCFD: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
                      NoCertificadoSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
                      SelloSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT']
                  }
              }
            };
            this.ELEMENT_DATA_TRASLADO.push(objTraslado);
            this.displayedColumnsTrasladoSelected.pop();
            this.displayedColumnsTrasladoSelected = this.displayedColumnsTraslado;
            break;
          // Ingreso
          case 'I':
            // Creación del objeto de tipo Ingreso
            var objetoIngreso: Ingreso = {
              id: this.generarIdUnico(),
              "xmlns:cfdi": dato['xmlns:cfdi'],
              "xmlns:xsi": dato['xmlns:xsi'],
              "xsi:schemaLocation": dato['xsi:schemaLocation'],
              Version: dato['Version'],
              Serie: dato['Serie'],
              Folio: dato['Folio'],
              Fecha: dato['Fecha'],
              FormaPago: dato['FormaPago'],
              CondicionesDePago: dato['CondicionesDePago'],
              SubTotal: dato['SubTotal'],
              Moneda: dato['Moneda'],
              Total: dato['Total'],
              TipoDeComprobante: dato['TipoDeComprobante'],
              MetodoPago: dato['MetodoPago'],
              LugarExpedicion: dato['LugarExpedicion'],
              Exportacion: dato['Exportacion'],
              Certificado: dato['Certificado'],
              NoCertificado: dato['NoCertificado'],
              Sello: dato['Sello'],
              "cfdi:InformacionGlobal": {
                  Periodicidad: dato["cfdi:InformacionGlobal:Periodicidad"],
                  Meses: dato["cfdi:InformacionGlobal:Meses"],
                  Año: dato["cfdi:InformacionGlobal:Año"]
              },
              "cfdi:Emisor": {
                  Rfc: dato["cfdi:Emisor:Rfc"],
                  Nombre: dato["cfdi:Emisor:Nombre"],
                  RegimenFiscal: dato["cfdi:Emisor:RegimenFiscal"]
              },
              "cfdi:Receptor": {
                  Rfc: dato["cfdi:Receptor:Rfc"],
                  Nombre: dato["cfdi:Receptor:Nombre"],
                  DomicilioFiscalReceptor: dato["cfdi:Receptor:DomicilioFiscalReceptor"],
                  RegimenFiscalReceptor: dato["cfdi:Receptor:RegimenFiscalReceptor"],
                  UsoCFDI: dato["cfdi:Receptor:UsoCFDI"]
              },
              "cfdi:Conceptos": {
                  "cfdi:Concepto": {
                      ClaveProdServ: dato['cfdi:Conceptos:cfdi:Concepto:ClaveProdServ'],
                      Cantidad: dato['cfdi:Conceptos:cfdi:Concepto:Cantidad'],
                      ClaveUnidad: dato['cfdi:Conceptos:cfdi:Concepto:ClaveUnidad'],
                      Unidad: dato['cfdi:Conceptos:cfdi:Concepto:Unidad'],
                      Descripcion: dato['cfdi:Conceptos:cfdi:Concepto:Descripcion'],
                      ValorUnitario: dato['cfdi:Conceptos:cfdi:Concepto:ValorUnitario'],
                      Importe: dato['cfdi:Conceptos:cfdi:Concepto:Importe'],
                      ObjetoImp: dato['cfdi:Conceptos:cfdi:Concepto:ObjetoImp'],
                      "cfdi:Impuestos": {
                          "cfdi:Traslados": {
                              "cfdi:Traslado": {
                                  Base: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base'],
                                  Impuesto: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto'],
                                  TipoFactor: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor'],
                                  TasaOCuota: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota'],
                                  Importe: dato['cfdi:Conceptos:cfdi:Concepto:cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe']
                              }
                          }
                      }
                  }
              },
              "cfdi:Impuestos": {
                  TotalImpuestosTrasladados: dato['cfdi:Impuestos:TotalImpuestosTrasladados'],
                  "cfdi:Traslados": {
                      "cfdi:Traslado": {
                          Base: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Base'],
                          Impuesto: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Impuesto'],
                          TipoFactor: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TipoFactor'],
                          TasaOCuota: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:TasaOCuota'],
                          Importe: dato['cfdi:Impuestos:cfdi:Traslados:cfdi:Traslado:Importe']
                      }
                  }
              },
              "cfdi:Complemento": {
                  "tfd:TimbreFiscalDigital": {
                      "xmlns:tfd": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd'],
                      "xsi:schemaLocation": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
                      Version: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:Version'],
                      SelloCFD: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
                      NoCertificadoSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
                      RfcProvCertif: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
                      UUID: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:UUID'],
                      FechaTimbrado: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
                      SelloSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT']
                    }
                  }
                };
            this.ELEMENT_DATA_INGRESO.push(objetoIngreso);
            this.displayedColumnsIngresoSelected.pop();
            this.displayedColumnsIngresoSelected = this.displayedColumnsIngreso;
            break;
          // Nomina
          case 'N':
            // Asignacion en la tabla de Nominas
            var objetoNomina: Nomina = {
                id: this.generarIdUnico(),
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
                "cfdi:Emisor": {
                  RegimenFiscal: dato["cfdi:Emisor:RegimenFiscal"],
                  Rfc: dato["cfdi:Emisor:Rfc"],
                  Nombre: dato["cfdi:Emisor:Nombre"]
                },
                "cfdi:Receptor": {
                  Rfc: dato["cfdi:Receptor:Rfc"],
                  Nombre: dato["cfdi:Receptor:Nombre"],
                  DomicilioFiscalReceptor: dato["cfdi:Receptor:DomicilioFiscalReceptor"],
                  RegimenFiscalReceptor: dato["cfdi:Receptor:RegimenFiscalReceptor"],
                  UsoCFDI: dato["cfdi:Receptor:UsoCFDI"]
                },
                "cfdi:Conceptos" : {
                  "cfdi:Concepto":{
                    ClaveProdServ: dato['cfdi:Conceptos:cfdi:Concepto:ClaveProdServ'],
                    Cantidad : dato['cfdi:Conceptos:cfdi:Concepto:Cantidad'],
                    ClaveUnidad : dato['cfdi:Conceptos:cfdi:Concepto:ClaveUnidad'],
                    Descripcion : dato['cfdi:Conceptos:cfdi:Concepto:Descripcion'],
                    ObjetoImp : dato['cfdi:Conceptos:cfdi:Concepto:ObjetoImp'],
                    ValorUnitario : dato['cfdi:Conceptos:cfdi:Concepto:ValorUnitario'],
                    Importe : dato['cfdi:Conceptos:cfdi:Concepto:Importe'],
                    Descuento : dato['cfdi:Conceptos:cfdi:Concepto:Descuento']
                  }
                },
                "cfdi:Complemento":{
                  "nomina12:Nomina":{
                    Version: dato['cfdi:Complemento:nomina12:Nomina:Version'],
                    TipoNomina: dato['cfdi:Complemento:nomina12:Nomina:TipoNomina'],
                    FechaPago: dato['cfdi:Complemento:nomina12:Nomina:FechaPago'],
                    FechaInicialPago: dato['cfdi:Complemento:nomina12:Nomina:FechaInicialPago'],
                    FechaFinalPago: dato['cfdi:Complemento:nomina12:Nomina:FechaFinalPago'],
                    NumDiasPagados: dato['cfdi:Complemento:nomina12:Nomina:NumDiasPagados'],
                    TotalPercepciones: dato['cfdi:Complemento:nomina12:Nomina:TotalPercepciones'],
                    TotalDeducciones: dato['cfdi:Complemento:nomina12:Nomina:TotalDeducciones'],
                    TotalOtrosPagos: dato['cfdi:Complemento:nomina12:Nomina:TotalOtrosPagos'],
                    "nomina12:Emisor":{
                      RegistroPatronal: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Emisor:RegistroPatronal'],
                    },
                    "nomina12:Receptor":{
                      Curp: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Curp'],
                      NumSeguridadSocial: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumSeguridadSocial'],
                      FechaInicioRelLaboral: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:FechaInicioRelLaboral'],
                      Antigüedad: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Antigüedad'],
                      TipoContrato: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoContrato'],
                      Sindicalizado: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Sindicalizado'],
                      TipoJornada: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoJornada'],
                      TipoRegimen: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:TipoRegimen'],
                      NumEmpleado: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:NumEmpleado'],
                      Departamento: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Departamento'],
                      Puesto: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:Puesto'],
                      RiesgoPuesto: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:RiesgoPuesto'],
                      PeriodicidadPago: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:PeriodicidadPago'],
                      SalarioBaseCotApor: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioBaseCotApor'],
                      SalarioDiarioIntegrado: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:SalarioDiarioIntegrado'],
                      ClaveEntFed: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Receptor:ClaveEntFed']
                    },
                    "nomina12:Percepciones":{
                      TotalSueldos: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalSueldos'],
                      TotalGravado: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalGravado'],
                      TotalExento: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:TotalExento'],
                      "nomina12:Percepcion": {
                        TipoPercepcion: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:TipoPercepcion'],
                        Clave: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Clave'],
                        Concepto: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:Concepto'],
                        ImporteGravado: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteGravado'],
                        ImporteExento: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Percepciones:nomina12:Percepcion:ImporteExento']
                      }
                    },
                    "nomina12:Deducciones":{
                      TotalOtrasDeducciones: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalOtrasDeducciones'],
                      TotalImpuestosRetenidos: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:TotalImpuestosRetenidos'],
                      "nomina12:Deduccion": [{
                        TipoDeduccion: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:TipoDeduccion'],
                        Clave: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Clave'],
                        Concepto: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Concepto'],
                        Importe: dato['cfdi:Complemento:nomina12:Nomina:nomina12:Deducciones:nomina12:Deduccion:0:Importe']
                      },
                    ]
                    },
                    "nomina12:OtrosPagos":{
                      "nomina12:OtroPago":{
                        TipoOtroPago: dato['cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:TipoOtroPago'],
                        Clave: dato['cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Clave'],
                        Concepto: dato['cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Concepto'],
                        Importe: dato['cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:Importe'],
                        "nomina12:SubsidioAlEmpleo": {
                          SubsidioCausado: dato['cfdi:Complemento:nomina12:Nomina:nomina12:OtrosPagos:nomina12:OtroPago:nomina12:SubsidioAlEmpleo:SubsidioCausado']
                        }
                      }
                    }
                  },
                  "tfd:TimbreFiscalDigital":{
                    "xmlns:tfd": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd'],
                    "xsi:schemaLocation": dato['cfdi:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
                    Version: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:Version'],
                    UUID: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:UUID'],
                    FechaTimbrado: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
                    RfcProvCertif: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
                    SelloCFD: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
                    NoCertificadoSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
                    SelloSAT: dato['cfdi:Complemento:tfd:TimbreFiscalDigital:SelloSAT']
                  }
                }
              };
            this.ELEMENT_DATA.push(objetoNomina);
            this.ELEMENT_DATA_NOMINA.push(objetoNomina);
            this.displayedColumnsNominaSelected.pop();
            this.displayedColumnsNominaSelected = this.displayedColumnsNomina;
            // this.dataSource.data.push(objetoNomina);
            // this.dataSource_Nomina.data.push(objetoNomina);
            break;
            }
          }
        else
        {
          // Retenciones
          var objetoRetencion: Retenciones = {
            id: this.generarIdUnico(),
            "xmlns:retenciones": dato['xmlns:retenciones'],
            "xmlns:xsi": dato['xmlns:xsi'],
            "xmlns:plataformasTecnologicas": dato['xmlns:plataformasTecnologicas'],
            "xsi:schemaLocation": dato['xsi:schemaLocation'],
            Version: dato['Version'],
            FolioInt: dato['FolioInt'],
            FechaExp: dato['FechaExp'],
            CveRetenc: dato['CveRetenc'],
            LugarExpRetenc: dato['LugarExpRetenc'],
            Certificado: dato['Certificado'],
            NoCertificado: dato['NoCertificado'],
            Sello: dato['Sello'],
            "retenciones:Emisor": {
                RfcE: dato["retenciones:Emisor:RfcE"],
                NomDenRazSocE: dato["retenciones:Emisor:NomDenRazSocE"],
                RegimenFiscalE: dato["retenciones:Emisor:RegimenFiscalE"]
            },
            "retenciones:Receptor": {
                NacionalidadR: dato["retenciones:Receptor:NacionalidadR"],
                "retenciones:Nacional": {
                    RfcR: dato["retenciones:Receptor:retenciones:Nacional:RfcR"],
                    NomDenRazSocR: dato["retenciones:Receptor:retenciones:Nacional:NomDenRazSocR"],
                    DomicilioFiscalR: dato["retenciones:Receptor:retenciones:Nacional:DomicilioFiscalR"]
                }
            },
            "retenciones:Periodo": {
                MesIni: dato["retenciones:Periodo:MesIni"],
                MesFin: dato["retenciones:Periodo:MesFin"],
                Ejercicio: dato["retenciones:Periodo:Ejercicio"]
            },
            "retenciones:Totales": {
                MontoTotOperacion: dato["retenciones:Totales:MontoTotOperacion"],
                MontoTotGrav: dato["retenciones:Totales:MontoTotGrav"],
                MontoTotExent: dato["retenciones:Totales:MontoTotExent"],
                MontoTotRet: dato["retenciones:Totales:MontoTotRet"],
                "retenciones:ImpRetenidos": [
                    {
                        BaseRet: dato["retenciones:Totales:retenciones:ImpRetenidos:0:BaseRet"],
                        ImpuestoRet: dato["retenciones:Totales:retenciones:ImpRetenidos:0:ImpuestoRet"],
                        MontoRet: dato["retenciones:Totales:retenciones:ImpRetenidos:0:MontoRet"],
                        TipoPagoRet: dato["retenciones:Totales:retenciones:ImpRetenidos:0:TipoPagoRet"]
                    }
                ]
            },
            "retenciones:Complemento": {
                "plataformasTecnologicas:ServiciosPlataformasTecnologicas": {
                    Version: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:Version"],
                    Periodicidad: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:Periodicidad"],
                    NumServ: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:NumServ"],
                    MonTotServSIVA: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:MonTotServSIVA"],
                    TotalIVATrasladado: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalIVATrasladado"],
                    TotalIVARetenido: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalIVARetenido"],
                    TotalISRRetenido: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalISRRetenido"],
                    DifIVAEntregadoPrestServ: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:DifIVAEntregadoPrestServ"],
                    MonTotalporUsoPlataforma: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:MonTotalporUsoPlataforma"],
                    "plataformasTecnologicas:Servicios": {
                      "plataformasTecnologicas:DetallesDelServicio": [
                          {
                              FormaPagoServ: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:FormaPagoServ"],
                              TipoDeServ: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:TipoDeServ"],
                              SubTipServ: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:SubTipServ"],
                              FechaServ: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:FechaServ"],
                              PrecioServSinIVA: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:PrecioServSinIVA"],
                              "plataformasTecnologicas:ImpuestosTrasladadosdelServicio": {
                                Base: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Base"],
                                Impuesto: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Impuesto"],
                                TipoFactor: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:TipoFactor"],
                                TasaCuota: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:TasaCuota"],
                                Importe: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Importe"],
                              },
                              "plataformasTecnologicas:ComisionDelServicio":
                              {
                                Importe: dato["retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ComisionDelServicio:Importe"],
                              }
                          }
                        ]
                      }
                    },
                    "tfd:TimbreFiscalDigital":{
                    "xsi:schemaLocation": dato['retenciones:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
                    Version: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:Version'],
                    UUID: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:UUID'],
                    FechaTimbrado: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
                    RfcProvCertif: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
                    SelloCFD: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
                    NoCertificadoSAT: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
                    SelloSAT: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:SelloSAT'],
                    "xmlns:tfd": dato['retenciones:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd'],
                    "xmlns:xsi": dato['retenciones:Complemento:tfd:TimbreFiscalDigital:xmlns:xsi'],
                  }
              }
          };
          this.ELEMENT_DATA_RETENCION.push(objetoRetencion);
          this.displayedColumnsRetencionSelected.pop();
          this.displayedColumnsRetencionSelected = this.displayedColumnsRetencion;
        }
    });

  }

  exportToExcel(): void {
    const inputElement: HTMLInputElement = this.fileInput.nativeElement;
    var nombreArchivo = 'Conversion';
    const fileName = nombreArchivo + '.xlsx';
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // Datos de la tabla de nomina
    const datosNomina = this.ELEMENT_DATA;
    // Datos de la tabla de ingresos
    const datosIngreso = this.ELEMENT_DATA_INGRESO;
    // Datos de la tabla de egresos
    const datosEgreso = this.ELEMENT_DATA_EGRESO;
    // Datos de la tabla de traslados
    const datosTraslado = this.ELEMENT_DATA_TRASLADO;
    // Datos de la tabla de retenciones
    const datosRetencion = this.ELEMENT_DATA_RETENCION;
    // Datos de la tabla de recepcion de pagos
    const datosRecepcionPago = this.ELEMENT_DATA_RECEPCION_PAGO;

    // Filtrar solo las columnas que deseas imprimir de nominas
    const datosFiltradosNomina = datosNomina.map(item => {
        const newItem: any = {};
        this.displayedColumnsNominaSelected.forEach(columna => {
          newItem[columna as keyof typeof item] = this.getElementValue(item, columna);
        });
        return newItem;
    });
    // const datosFiltradosNomina = datosNomina;

    // Filtrar solo las columnas que deseas imprimir de ingresos
    const datosFiltradosIngreso = datosIngreso.map(item => {
        // var newItem: any[] = [];
        const newItem: any = {};

        this.displayedColumnsIngresoSelected.forEach(columna => {
          newItem[columna as keyof typeof item] = this.getElementValue(item, columna);
          // newItem.push(this.getElementValue(item, columna))
        });
        return newItem;
    });
    // const datosFiltradosIngreso = datosIngreso;


    // Filtrar solo las columnas que deseas imprimir de egresos
    const datosFiltradosEgreso = datosEgreso.map(item => {
      const newItem: any = {};
      this.displayedColumnsEgresoSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = this.getElementValue(item, columna);
      });
      return newItem;
    });
    // Filtrar solo las columnas que deseas imprimir de traslados
    const datosFiltradosTraslado = datosTraslado.map(item => {
      const newItem: any = {};
      this.displayedColumnsTrasladoSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = this.getElementValue(item, columna);
      });
      return newItem;
    });
    // Filtrar solo las columnas que deseas imprimir de retenciones
    const datosFiltradosRetencion = datosRetencion.map(item => {
      const newItem: any = {};
      this.displayedColumnsRetencionSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = this.getElementValue(item, columna);
      });
      return newItem;
    });
    // Filtrar solo las columnas que deseas imprimir de recepcion de pagos
    const datosFiltradosRecepcionPago = datosRecepcionPago.map(item => {
      const newItem: any = {};
      this.displayedColumnsRecepcionPagoSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = this.getElementValue(item, columna);
      });
      return newItem;
    });

    // Define una función para crear hojas de cálculo
    const createSheet = (data: any[], sheetName: string, displayedColumns: string[]) => {
      if (data.length > 0) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { cellStyles: true});
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    };


    // Crear una nueva hoja de trabajo con los datos filtrados de nominas
    if(this.ELEMENT_DATA.length > 0){
      createSheet(datosFiltradosNomina, 'Nóminas', this.displayedColumnsNominaSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de ingresos
    if(this.ELEMENT_DATA_INGRESO.length > 0){
      createSheet(datosFiltradosIngreso, 'Ingresos', this.displayedColumnsIngresoSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de egresos
    if(this.ELEMENT_DATA_EGRESO.length > 0){
      createSheet(datosFiltradosEgreso, 'Egresos', this.displayedColumnsEgresoSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de traslados
    if(this.ELEMENT_DATA_TRASLADO.length > 0){
      createSheet(datosFiltradosTraslado, 'Traslados', this.displayedColumnsTrasladoSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de retenciones
    if(this.ELEMENT_DATA_RETENCION.length > 0){
      createSheet(datosFiltradosRetencion, 'Retenciones', this.displayedColumnsRetencionSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de recepcion de pagos
    if(this.ELEMENT_DATA_RECEPCION_PAGO.length > 0){
      createSheet(datosFiltradosRecepcionPago, 'Recepción de pagos', this.displayedColumnsRecepcionPagoSelected);
    }
    // Guardar el libro de Excel
    XLSX.writeFile(wb, fileName);
  }

  openDialog(listaSeleccionada : string[], tipoFactura: string): void {
    const dialogRef = this.dialog.open(DialogSelectorColumnComponent, {
      disableClose: true,
      maxHeight: '60vh',
      position: {top: '10vh'},
      data: {
        columnSelected : listaSeleccionada,
        columnSelectedBoolean : Array(listaSeleccionada.length).fill(true)
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      switch(tipoFactura){
        case 'Ingreso':
          this.displayedColumnsIngresoSelected = result;
          break;
        case 'Egreso':
          this.displayedColumnsEgresoSelected = result;
          break;
        case 'Traslado':
          this.displayedColumnsTrasladoSelected = result;
          break;
        case 'Nomina':
          this.displayedColumnsNominaSelected = result;
          break;
        case 'Retencion':
          this.displayedColumnsRetencionSelected = result;
          break;
        case 'RecepcionPago':
          this.displayedColumnsRecepcionPagoSelected = result;
          break;
      }
    });
  }

  generarIdUnico(): number {
    // Obtiene la marca de tiempo actual
    const tiempoActual: number = new Date().getTime();

    // Genera un número aleatorio entre 0 y 9999
    const numeroAleatorio: number = Math.floor(Math.random() * 10000);

    // Combina la marca de tiempo y el número aleatorio para crear un ID único
    const idUnico: number = parseInt(tiempoActual.toString() + numeroAleatorio.toString());

    return idUnico;
  }

  getElementValue(element: any, col: string): any {
    /// Prueba 1
    //   const parts = col.split(':'); // Dividir la cadena por ":"
    //   const formattedParts: string[] = [];

    //   for (let i = 0; i < parts.length; i += 2) {
    //     if (i + 1 < parts.length) {
    //       formattedParts.push(`['${parts[i]}${parts[i + 1].includes(':') ? ':' : ':'}${parts[i + 1]}']`);
    //     } else {
    //       formattedParts.push(parts[i]);
    //     }
    //   }

    // var result = formattedParts.join('');
    // result.replace(/\[(\d+)\]/g, '[$1]');
    // var r = result.replace(/\]([^:]+)$/g, (match, group1) => `].${group1}`);

    const PROPS = col.split(':');
    const formattedParts: string[] = [];

    for (let i = 0; i < PROPS.length; i += 2) {
      if (i + 1 < PROPS.length) {
        formattedParts.push(`${PROPS[i]}${PROPS[i + 1].includes(':') ? ':' : ':'}${PROPS[i + 1]}`);
      } else {
        formattedParts.push(PROPS[i]);
      }
    }
    let value = element;
    // console.log("formattedParts: ", formattedParts)
      // VERIFICAR SI LA PROPIEDAD CONTIENE UN ÍNDICE DE MATRIZ
    if (formattedParts.length > 1) {
      switch(formattedParts.length){
        case 2:
          if(formattedParts[1] in value[formattedParts[0]]){
            return value[formattedParts[0]][formattedParts[1]];
          }
          break;
        case 3:
          if(formattedParts[2] in value[formattedParts[0]][formattedParts[1]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]];
          }
          break;
        case 4:
          if(formattedParts[3] in value[formattedParts[0]][formattedParts[1]][formattedParts[2]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]];
          }
          break;
        case 5:
          if(formattedParts[4] in value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]];
          }
          break;
        case 6:
          if(formattedParts[5] in value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]];
          }
          break;
        case 7:
          if(formattedParts[6] in value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]][formattedParts[6]];
          }
          break;
        case 8:
          if(formattedParts[7] in value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]][formattedParts[6]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]][formattedParts[6]][formattedParts[7]];
          }
          break;
        case 9:
          if(formattedParts[8] in value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]][formattedParts[6]][formattedParts[7]]){
            return value[formattedParts[0]][formattedParts[1]][formattedParts[2]][formattedParts[3]][formattedParts[4]][formattedParts[5]][formattedParts[6]][formattedParts[7]][formattedParts[8]];
          }
          break;
      }
    } else {
      // ACCEDER NORMALMENTE A LA PROPIEDAD
      if (value && value.hasOwnProperty(formattedParts[0])) {
        value = value[formattedParts[0]];
      } else {
        return value[formattedParts[0]]; // DEVOLVER NULL SI LA PROPIEDAD NO ESTÁ DEFINIDA
      }
    }

    return value;
  }
  handlePageEvent($event: PageEvent, tipoFactura : string) {
    switch (tipoFactura) {
      case 'Ingreso':
        if(this.ELEMENT_DATA_INGRESO.length > 0){
          const startIndex = $event.pageIndex * $event.pageSize;
          const endIndex = startIndex + $event.pageSize;
          this.dataSource_Ingreso.data = this.ELEMENT_DATA_INGRESO.slice(startIndex, endIndex);
          this.paginatorIngresos.length = this.ELEMENT_DATA_INGRESO.length;
          this.displayedColumnsIngresoSelected.pop();
          this.displayedColumnsIngresoSelected = this.displayedColumnsIngreso;
          // console.log("this.dataSource_Ingreso.data: ", this.dataSource_Ingreso.data)
        }
        break;
        case 'Egreso':
          if(this.ELEMENT_DATA_EGRESO.length > 0){
            const startIndex = $event.pageIndex * $event.pageSize;
            const endIndex = startIndex + $event.pageSize;
            this.dataSource_Egreso.data = this.ELEMENT_DATA_EGRESO.slice(startIndex, endIndex);
            this.paginatorEgresos.length = this.ELEMENT_DATA_EGRESO.length;
            this.displayedColumnsEgresoSelected.pop();
            this.displayedColumnsEgresoSelected = this.displayedColumnsEgreso;
            // console.log("this.dataSource_Egreso.data: ", this.dataSource_Egreso.data)
          }
          break;
        case 'Traslado':
          if(this.ELEMENT_DATA_TRASLADO.length > 0){
            const startIndex = $event.pageIndex * $event.pageSize;
            const endIndex = startIndex + $event.pageSize;
            this.dataSource_Traslado.data = this.ELEMENT_DATA_TRASLADO.slice(startIndex, endIndex);
            this.paginatorTraslados.length = this.ELEMENT_DATA_TRASLADO.length;
            this.displayedColumnsTrasladoSelected.pop();
            this.displayedColumnsTrasladoSelected = this.displayedColumnsTraslado;
            // console.log("this.dataSource_Traslado.data: ", this.dataSource_Traslado.data)
          }
          break;
        case 'Nomina':
          if(this.ELEMENT_DATA_NOMINA.length > 0){
            const startIndex = $event.pageIndex * $event.pageSize;
            const endIndex = startIndex + $event.pageSize;
            this.dataSource.data = this.ELEMENT_DATA_NOMINA.slice(startIndex, endIndex);
            this.paginatorNominas.length = this.ELEMENT_DATA_NOMINA.length;
            this.displayedColumnsNominaSelected.pop();
            this.displayedColumnsNominaSelected = this.displayedColumnsNomina;
            // console.log("this.dataSource.data: ", this.dataSource.data)
          }
          break;
          case 'RecepcionPago':
            if(this.ELEMENT_DATA_RECEPCION_PAGO.length > 0){
              const startIndex = $event.pageIndex * $event.pageSize;
              const endIndex = startIndex + $event.pageSize;
              this.dataSource_Recepcion_Pagos.data = this.ELEMENT_DATA_RECEPCION_PAGO.slice(startIndex, endIndex);
              this.paginatorRecepcionPagos.length = this.ELEMENT_DATA_RECEPCION_PAGO.length;
              this.displayedColumnsRecepcionPagoSelected.pop();
              this.displayedColumnsRecepcionPagoSelected = this.displayedColumnsRecepcionPago;
              // console.log("this.dataSource_Recepcion_Pagos.data: ", this.dataSource_Recepcion_Pagos.data)
            }
            break;
          case 'Retencion':
            if(this.ELEMENT_DATA_RETENCION.length > 0){
              const startIndex = $event.pageIndex * $event.pageSize;
              const endIndex = startIndex + $event.pageSize;
              this.dataSource_Retencion.data = this.ELEMENT_DATA_RETENCION.slice(startIndex, endIndex);
              this.paginatorRetenciones.length = this.ELEMENT_DATA_RETENCION.length;
              this.displayedColumnsRetencionSelected.pop();
              this.displayedColumnsRetencionSelected = this.displayedColumnsRetencion;
              // console.log("this.dataSource_Retencion.data: ", this.dataSource_Retencion.data)
            }
            break;
      default:
        break;
    }
  }
  scrollToTop() {
    var elmnt = document.getElementById("popupFiles");
    elmnt!.scrollIntoView(true); // Top
  }
}

