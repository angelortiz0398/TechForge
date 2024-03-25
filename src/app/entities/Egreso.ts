export interface Egreso {
  id : number,
  "xmlns:cfdi": string
  "xmlns:xsi": string
  "xsi:schemaLocation": string
  Version: string
  Fecha: string
  Serie: string
  Folio: string
  FormaPago: string
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
  "cfdi:CfdiRelacionados": CfdiCfdiRelacionados
  "cfdi:Emisor": CfdiEmisor
  "cfdi:Receptor": CfdiReceptor
  "cfdi:Conceptos": CfdiConceptos
  "cfdi:Impuestos": CfdiImpuestos2
}

export interface CfdiCfdiRelacionados {
  TipoRelacion: string
  "cfdi:CfdiRelacionado": CfdiCfdiRelacionado
}

export interface CfdiCfdiRelacionado {
  UUID: string
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
  Cantidad: string
  Unidad: string
  NoIdentificacion: string
  Descripcion: string
  ValorUnitario: string
  Importe: string
  ClaveProdServ: string
  ClaveUnidad: string
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
  Importe: string
  TasaOCuota: string
  TipoFactor: string
}
