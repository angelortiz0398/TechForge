import { DropfileDirective, FileHandle } from './../Dropfile.directive';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
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
  dataSource_Ingreso = new MatTableDataSource<Ingreso>(ELEMENT_DATA_INGRESO);
  dataSource_Egreso = new MatTableDataSource<Egreso>(ELEMENT_DATA_EGRESO);
  dataSource_Traslado = new MatTableDataSource<Traslado>(ELEMENT_DATA_TRASLADO);
  dataSource_Retencion = new MatTableDataSource<Retenciones>(ELEMENT_DATA_RETENCION);
  dataSource_Nomina = new MatTableDataSource<Nomina>(ELEMENT_DATA_NOMINA);
  dataSource_Recepcion_Pagos = new MatTableDataSource<RecepcionPago>(ELEMENT_DATA_RECEPCION_PAGO);
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
    'id',
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
    'id',
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
    'id',
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
    'id',
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
    'id',
    'retenciones:Retenciones:xmlns:retenciones',
    'retenciones:Retenciones:xmlns:xsi',
    'retenciones:Retenciones:xmlns:plataformasTecnologicas',
    'retenciones:Retenciones:xsi:schemaLocation',
    'retenciones:Retenciones:Version',
    'retenciones:Retenciones:FolioInt',
    'retenciones:Retenciones:FechaExp',
    'retenciones:Retenciones:CveRetenc',
    'retenciones:Retenciones:LugarExpRetenc',
    'retenciones:Retenciones:Certificado',
    'retenciones:Retenciones:NoCertificado',
    'retenciones:Retenciones:Sello',
    'retenciones:Retenciones:retenciones:Emisor:RfcE',
    'retenciones:Retenciones:retenciones:Emisor:NomDenRazSocE',
    'retenciones:Retenciones:retenciones:Emisor:RegimenFiscalE',
    'retenciones:Retenciones:retenciones:Receptor:NacionalidadR',
    'retenciones:Retenciones:retenciones:Receptor:retenciones:Nacional:RfcR',
    'retenciones:Retenciones:retenciones:Receptor:retenciones:Nacional:NomDenRazSocR',
    'retenciones:Retenciones:retenciones:Receptor:retenciones:Nacional:DomicilioFiscalR',
    'retenciones:Retenciones:retenciones:Periodo:MesIni',
    'retenciones:Retenciones:retenciones:Periodo:MesFin',
    'retenciones:Retenciones:retenciones:Periodo:Ejercicio',
    'retenciones:Retenciones:retenciones:Totales:MontoTotOperacion',
    'retenciones:Retenciones:retenciones:Totales:MontoTotGrav',
    'retenciones:Retenciones:retenciones:Totales:MontoTotExent',
    'retenciones:Retenciones:retenciones:Totales:MontoTotRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:0:BaseRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:0:ImpuestoRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:0:MontoRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:0:TipoPagoRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:1:BaseRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:1:ImpuestoRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:1:MontoRet',
    'retenciones:Retenciones:retenciones:Totales:retenciones:ImpRetenidos:1:TipoPagoRet',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:Version',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:Periodicidad',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:NumServ',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:MonTotServSIVA',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalIVATrasladado',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalIVARetenido',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:TotalISRRetenido',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:DifIVAEntregadoPrestServ',
    'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:MonTotalporUsoPlataforma',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:FormaPagoServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:TipoDeServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:SubTipServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:FechaServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:PrecioServSinIVA',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Base',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Impuesto',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:TipoFactor',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:TasaCuota',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ImpuestosTrasladadosdelServicio:Importe',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:0:plataformasTecnologicas:ComisionDelServicio:Importe',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:FormaPagoServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:TipoDeServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:SubTipServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:FechaServ',
    // 'retenciones:Retenciones:retenciones:Complemento:plataformasTecnologicas:ServiciosPlataformasTecnologicas:plataformasTecnologicas:Servicios:plataformasTecnologicas:DetallesDelServicio:1:PrecioServSinIVA',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:Version',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:SelloCFD',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:UUID',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:FechaTimbrad',
    'retenciones:Retenciones:retenciones:Complemento:tfd:TimbreFiscalDigital:SelloSAT'
  ];
  displayedColumnsNominaSelected: string[] = this.displayedColumnsNomina;
  displayedColumnsEgresoSelected: string[] = this.displayedColumnsEgreso;
  displayedColumnsIngresoSelected: string[] = this.displayedColumnsIngreso;
  displayedColumnsRecepcionPagoSelected: string[] = this.displayedColumnsRecepcionPago;
  displayedColumnsTrasladoSelected: string[] = this.displayedColumnsTraslado;
  displayedColumnsRetencionSelected: string[] = this.displayedColumnsRetencion;

  constructor(public dialog: MatDialog) {}

  ngBeforeViewInit(){
    this.displayedColumnsNominaSelected = this.displayedColumnsNomina;

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.displayedColumnsNominaSelected = this.displayedColumnsNomina;
    this.displayedColumnsEgresoSelected = this.displayedColumnsEgreso;
    this.displayedColumnsIngresoSelected = this.displayedColumnsIngreso;
    this.displayedColumnsRecepcionPagoSelected = this.displayedColumnsRecepcionPago;
    this.displayedColumnsTrasladoSelected = this.displayedColumnsTraslado;
    this.displayedColumnsRetencionSelected = this.displayedColumnsRetencion;
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
        this.bodyXML += "\n====== " + event.target.files[index].name + "======\n";
        this.bodyXML += contenido;
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
              case 8:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ][subcadenas[3]][subcadenas[4]][subcadenas[5]][subcadenas[6]][subcadenas[7]];
                break;
              case 9:
                fila[columna.nombre] =
                  datosXML[propiedadPadre][subcadenas[0]][subcadenas[1]][
                    subcadenas[2]
                  ][subcadenas[3]][subcadenas[4]][subcadenas[5]][subcadenas[6]][subcadenas[7]][subcadenas[8]];
                break;
            }
          }
        }
        this.datos.push(fila);
      }
    }
    console.log('columnas: ', this.columnas);
    console.log('datos: ', this.datos);

    this.datos.forEach((dato) => {
      console.log("propiedadPadre: ", propiedadPadre)
      console.log("tipoDocumento: ", tipoDocumento)
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
            ELEMENT_DATA_RECEPCION_PAGO.push(objetoRecepcionPago);
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
            ELEMENT_DATA_EGRESO.push(objetoEgresos);
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
            ELEMENT_DATA_TRASLADO.push(objTraslado);
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
            ELEMENT_DATA_INGRESO.push(objetoIngreso);
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
            ELEMENT_DATA.push(objetoNomina);
            ELEMENT_DATA_NOMINA.push(objetoNomina);
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
                    "xmlns:tfd": dato['retenciones:Complemento:tfd:TimbreFiscalDigital:xmlns:tfd'],
                    "xsi:schemaLocation": dato['retenciones:Complemento:tfd:TimbreFiscalDigital:xsi:schemaLocation'],
                    Version: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:Version'],
                    SelloCFD: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:SelloCFD'],
                    NoCertificadoSAT: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:NoCertificadoSAT'],
                    RfcProvCertif: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:RfcProvCertif'],
                    UUID: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:UUID'],
                    FechaTimbrado: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:FechaTimbrado'],
                    SelloSAT: dato['retenciones:Complemento:tfd:TimbreFiscalDigital:SelloSAT'],
                  }
              }
          };
          ELEMENT_DATA_RETENCION.push(objetoRetencion);
          this.displayedColumnsRetencionSelected.pop();
          this.displayedColumnsRetencionSelected = this.displayedColumnsRetencion;
        }
    });
    console.log("this.dataSource_Retencion.data", this.dataSource_Retencion.data)
  }

  exportToExcel(): void {
    const inputElement: HTMLInputElement = this.fileInput.nativeElement;
    var nombreArchivo = 'Conversion';
    const fileName = nombreArchivo + '.xlsx';
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // Datos de la tabla de nomina
    const datosNomina = this.dataSource.data;
    // Datos de la tabla de ingresos
    const datosIngreso = this.dataSource_Ingreso.data;
    // Datos de la tabla de egresos
    const datosEgreso = this.dataSource_Egreso.data;
    // Datos de la tabla de traslados
    const datosTraslado = this.dataSource_Traslado.data;
    // Datos de la tabla de retenciones
    const datosRetencion = this.dataSource_Retencion.data;
    // Datos de la tabla de recepcion de pagos
    const datosRecepcionPago = this.dataSource_Recepcion_Pagos.data;

    // Filtrar solo las columnas que deseas imprimir de nominas
    const datosFiltradosNomina = datosNomina.map(item => {
        const newItem: any = {};
        this.displayedColumnsNominaSelected.forEach(columna => {
          newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
        });
        return newItem;
    });

    // Filtrar solo las columnas que deseas imprimir de ingresos
    const datosFiltradosIngreso = datosIngreso.map(item => {
        const newItem: any = {};
        this.displayedColumnsIngresoSelected.forEach(columna => {
          newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
        });
        return newItem;
    });

    // Filtrar solo las columnas que deseas imprimir de egresos
    const datosFiltradosEgreso = datosEgreso.map(item => {
      const newItem: any = {};
      this.displayedColumnsEgresoSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
      });
      return newItem;
    });
    // Filtrar solo las columnas que deseas imprimir de traslados
    const datosFiltradosTraslado = datosTraslado.map(item => {
      const newItem: any = {};
      this.displayedColumnsTrasladoSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
      });
      return newItem;
    });
    // Filtrar solo las columnas que deseas imprimir de retenciones
    const datosFiltradosRetencion = datosRetencion.map(item => {
      const newItem: any = {};
      this.displayedColumnsRetencionSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
      });
      return newItem;
    });
    // Filtrar solo las columnas que deseas imprimir de recepcion de pagos
    const datosFiltradosRecepcionPago = datosRecepcionPago.map(item => {
      const newItem: any = {};
      this.displayedColumnsRecepcionPagoSelected.forEach(columna => {
        newItem[columna as keyof typeof item] = item[columna as keyof typeof item];
      });
      return newItem;
    });

    // Define una función para crear hojas de cálculo
    const createSheet = (data: any[], sheetName: string, displayedColumns: string[]) => {
      if (data.length > 0) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    };

    // Crear una nueva hoja de trabajo con los datos filtrados de nominas
    if(this.dataSource.data.length > 0){
      createSheet(datosFiltradosNomina, 'Nóminas', this.displayedColumnsNominaSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de ingresos
    if(this.dataSource_Ingreso.data.length > 0){
      createSheet(datosFiltradosIngreso, 'Ingresos', this.displayedColumnsIngresoSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de egresos
    if(this.dataSource_Egreso.data.length > 0){
      createSheet(datosFiltradosEgreso, 'Egresos', this.displayedColumnsEgresoSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de traslados
    if(this.dataSource_Traslado.data.length > 0){
      createSheet(datosFiltradosTraslado, 'Traslados', this.displayedColumnsTrasladoSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de retenciones
    if(this.dataSource_Retencion.data.length > 0){
      createSheet(datosFiltradosRetencion, 'Retenciones', this.displayedColumnsRetencionSelected);
    }
    // Crear una nueva hoja de trabajo con los datos filtrados de recepcion de pagos
    if(this.dataSource_Recepcion_Pagos.data.length > 0){
      createSheet(datosFiltradosRecepcionPago, 'Recepción de pagos', this.displayedColumnsRecepcionPagoSelected);
    }
    // Guardar el libro de Excel
    XLSX.writeFile(wb, fileName);
  }

  openDialog(listaSeleccionada : string[], tipoFactura: string): void {
    const dialogRef = this.dialog.open(DialogSelectorColumnComponent, {
      disableClose: true,
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
    if (col.includes(':')) {
      const props = col.split(':');
      let value = element;
      for (let i = 0; i < props.length - 1; i += 2) {
        const propName = props[i];
        const subPropName = props[i + 1];
        if (value) {
          value = value[propName];
          if (value) {
            value = value[subPropName];
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
      return value;
    } else {
      return element[col];
    }
  }
}

var ELEMENT_DATA: Nomina[] = [];
var ELEMENT_DATA_EGRESO: Egreso[] = [];
var ELEMENT_DATA_INGRESO: Ingreso[] = [];
var ELEMENT_DATA_NOMINA: Nomina[] = [];
var ELEMENT_DATA_RECEPCION_PAGO: RecepcionPago[] = [];
var ELEMENT_DATA_RETENCION: Retenciones[] = [];
var ELEMENT_DATA_TRASLADO: Traslado[] = [];
