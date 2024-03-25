export interface RecepcionPago {
  id : number,
  "xsi:schemaLocation": string
  Version: string
  Serie: string
  Folio: string
  Fecha: string
  NoCertificado: string
  SubTotal: string
  Moneda: string
  Total: string
  LugarExpedicion: string
  TipoDeComprobante: string
  Exportacion: string
  Certificado: string
  Sello: string
  "xmlns:cfdi": string
  "xmlns:pago20": string
  "xmlns:xsi": string
  "cfdi:Emisor": CfdiEmisor
  "cfdi:Receptor": CfdiReceptor
  "cfdi:Conceptos": CfdiConceptos
  "cfdi:Complemento": CfdiComplemento
  "cfdi:Addenda": CfdiAddenda
}

export interface CfdiEmisor {
  Rfc: string
  Nombre: string
  RegimenFiscal: string
}

export interface CfdiReceptor {
  Rfc: string
  Nombre: string
  UsoCFDI: string
  DomicilioFiscalReceptor: string
  RegimenFiscalReceptor: string
}

export interface CfdiConceptos {
  "cfdi:Concepto": CfdiConcepto
}

export interface CfdiConcepto {
  Cantidad: string
  ValorUnitario: string
  Importe: string
  ClaveUnidad: string
  Descripcion: string
  ClaveProdServ: string
  ObjetoImp: string
}

export interface CfdiComplemento {
  "pago20:Pagos": Pago20Pagos
  "tfd:TimbreFiscalDigital": TfdTimbreFiscalDigital
}

export interface Pago20Pagos {
  Version: string
  "pago20:Totales": Pago20Totales
  "pago20:Pago": Pago20Pago
}

export interface Pago20Totales {
  TotalRetencionesIVA: string
  TotalRetencionesISR: string
  TotalRetencionesIEPS: string
  TotalTrasladosBaseIVA16: string
  TotalTrasladosImpuestoIVA16: string
  TotalTrasladosBaseIVA8: string
  TotalTrasladosImpuestoIVA8: string
  TotalTrasladosBaseIVA0: string
  TotalTrasladosImpuestoIVA0: string
  TotalTrasladosBaseIVAExento: string
  MontoTotalPagos: string
}

export interface Pago20Pago {
  FechaPago: string
  FormaDePagoP: string
  MonedaP: string
  TipoCambioP: string
  Monto: string
  NumOperacion: string
  NomBancoOrdExt: string
  "pago20:DoctoRelacionado": Pago20DoctoRelacionado
  "pago20:ImpuestosP": Pago20ImpuestosP
}

export interface Pago20DoctoRelacionado {
  IdDocumento: string
  Serie: string
  Folio: string
  MonedaDR: string
  NumParcialidad: string
  ImpSaldoAnt: string
  ImpPagado: string
  ImpSaldoInsoluto: string
  ObjetoImpDR: string
  EquivalenciaDR: string
  "pago20:ImpuestosDR": Pago20ImpuestosDr
}

export interface Pago20ImpuestosDr {
  "pago20:RetencionesDR": Pago20RetencionesDr
  "pago20:TrasladosDR": Pago20TrasladosDr
}

export interface Pago20RetencionesDr {
  "pago20:RetencionDR": Pago20RetencionDr
}

export interface Pago20RetencionDr {
  BaseDR: string
  ImpuestoDR: string
  TipoFactorDR: string
  TasaOCuotaDR: string
  ImporteDR: string
}

export interface Pago20TrasladosDr {
  "pago20:TrasladoDR": Pago20TrasladoDr
}

export interface Pago20TrasladoDr {
  BaseDR: string
  ImpuestoDR: string
  TipoFactorDR: string
  TasaOCuotaDR: string
  ImporteDR: string
}

export interface Pago20ImpuestosP {
  "pago20:RetencionesP": Pago20RetencionesP
  "pago20:TrasladosP": Pago20TrasladosP
}

export interface Pago20RetencionesP {
  "pago20:RetencionP": Pago20RetencionP
}

export interface Pago20RetencionP {
  ImpuestoP: string
  ImporteP: string
}

export interface Pago20TrasladosP {
  "pago20:TrasladoP": Pago20TrasladoP
}

export interface Pago20TrasladoP {
  BaseP: string
  ImpuestoP: string
  TipoFactorP: string
  TasaOCuotaP: string
  ImporteP: string
}

export interface TfdTimbreFiscalDigital {
  Version: string
  UUID: string
  FechaTimbrado: string
  RfcProvCertif: string
  SelloCFD: string
  NoCertificadoSAT: string
  SelloSAT: string
  "xsi:schemaLocation": string
  "xmlns:tfd": string
}

export interface CfdiAddenda {
  "if:DocumentoInterfactura": IfDocumentoInterfactura
}

export interface IfDocumentoInterfactura {
  "xmlns:if": string
  "xmlns:xsi": string
  "xsi:schemaLocation": string
  "if:Emisor": IfEmisor
  "if:Receptor": IfReceptor
  "if:Encabezado": IfEncabezado
}

export interface IfEmisor {
  nombre: string
  RFC: string
}

export interface IfReceptor {
  RFC: string
  nombre: string
  cfdiRegimenFiscalReceptor: string
  domicilioFiscalReceptor: string
  "if:Domicilio": IfDomicilio
}

export interface IfDomicilio {
  codigoPostal: string
  colonia: string
  municipio: string
  pais: string
}

export interface IfEncabezado {
  ResidenciaFiscal: string
  SubTotal: string
  Total: string
  Moneda: string
  TipoDocumento: string
  LugarExpedicion: string
  RegimenFiscalEmisor: string
  cfdiUsoCFDI: string
  FolioReferencia: string
  Serie: string
  Receptor_Email: string
  Receptor_Domicilio_CodigoPostal: string
  Folio: string
  cfdiExportacion: string
  Version: string
  AsuntoCorreo: string
  RulesApplied: string
  cadenaOriginal: string
  "if:Cuerpo": IfCuerpo
  "if:Pagos": IfPagos
}

export interface IfCuerpo {
  Renglon: string
  Cantidad: string
  cfdiClaveProdServ: string
  cfdiClaveUnidad: string
  Concepto: string
  PUnitario: string
  Importe: string
  cfdiObjetoImp: string
}

export interface IfPagos {
  TotalRetencionesIVA: string
  TotalRetencionesISR: string
  TotalRetencionesIEPS: string
  TotalTrasladosBaseIVA16: string
  TotalTrasladosImpuestoIVA16: string
  TotalTrasladosBaseIVA8: string
  TotalTrasladosImpuestoIVA8: string
  TotalTrasladosBaseIVA0: string
  TotalTrasladosImpuestoIVA0: string
  TotalTrasladosBaseIVAExento: string
  MontoTotalPagos: string
  "if:pago20Pago": IfPago20Pago
}

export interface IfPago20Pago {
  pagoFechaPago: string
  pagoFormaDePagoP: string
  pagoMonedaP: string
  pagoTipoCambioP: string
  pagoMonto: string
  pagoNumOperacion: string
  pagoNomBancoOrdExt: string
}
