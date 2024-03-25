export interface Ingreso {
  id : number,
  "xmlns:cfdi": string
  "xmlns:xsi": string
  "xsi:schemaLocation": string
  Version: string
  Serie: string
  Folio: string
  Fecha: string
  FormaPago: string
  CondicionesDePago: string
  SubTotal: string
  Moneda: string
  Total: string
  TipoDeComprobante: string
  MetodoPago: string
  LugarExpedicion: string
  Exportacion: string
  Certificado: string
  NoCertificado: string
  Sello: string
  "cfdi:InformacionGlobal": CfdiInformacionGlobal
  "cfdi:Emisor": CfdiEmisor
  "cfdi:Receptor": CfdiReceptor
  "cfdi:Conceptos": CfdiConceptos
  "cfdi:Impuestos": CfdiImpuestos2
  "cfdi:Complemento": CfdiComplemento
}

export interface CfdiInformacionGlobal {
  Periodicidad: string
  Meses: string
  Año: string
}

export interface CfdiEmisor {
  Rfc: string
  Nombre: string
  RegimenFiscal: string
}

export interface CfdiReceptor {
  Rfc: string
  Nombre: string
  DomicilioFiscalReceptor: string
  RegimenFiscalReceptor: string
  UsoCFDI: string
}

export interface CfdiConceptos {
  "cfdi:Concepto": CfdiConcepto
}

export interface CfdiConcepto {
  ClaveProdServ: string
  Cantidad: string
  ClaveUnidad: string
  Unidad: string
  Descripcion: string
  ValorUnitario: string
  Importe: string
  ObjetoImp: string
  "cfdi:Impuestos": CfdiImpuestos
}

export interface CfdiImpuestos {
  "cfdi:Traslados": CfdiTraslados
}

export interface CfdiTraslados {
  "cfdi:Traslado": CfdiTraslado
}

export interface CfdiTraslado {
  Base: string
  Impuesto: string
  TipoFactor: string
  TasaOCuota: string
  Importe: string
}

export interface CfdiImpuestos2 {
  TotalImpuestosTrasladados: string
  "cfdi:Traslados": CfdiTraslados2
}

export interface CfdiTraslados2 {
  "cfdi:Traslado": CfdiTraslado2
}

export interface CfdiTraslado2 {
  Base: string
  Impuesto: string
  TipoFactor: string
  TasaOCuota: string
  Importe: string
}

export interface CfdiComplemento {
  "tfd:TimbreFiscalDigital": TfdTimbreFiscalDigital
}

export interface TfdTimbreFiscalDigital {
  "xmlns:tfd": string
  "xsi:schemaLocation": string
  Version: string
  SelloCFD: string
  NoCertificadoSAT: string
  RfcProvCertif: string
  UUID: string
  FechaTimbrado: string
  SelloSAT: string
}
