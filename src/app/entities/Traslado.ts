export interface Traslado {
  id : number,
  "xmlns:cfdi": string
  "xmlns:xsi": string
  "xsi:schemaLocation": string
  Version: string
  Fecha: string
  Serie: string
  Folio: string
  SubTotal: string
  Moneda: string
  Total: string
  TipoDeComprobante: string
  LugarExpedicion: string
  Exportacion: string
  Certificado: string
  NoCertificado: string
  Sello: string
  "cfdi:Emisor": CfdiEmisor
  "cfdi:Receptor": CfdiReceptor
  "cfdi:Conceptos": CfdiConceptos
  "cfdi:Complemento": CfdiComplemento
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
}

export interface CfdiComplemento {
  "tfd:TimbreFiscalDigital": TfdTimbreFiscalDigital
}

export interface TfdTimbreFiscalDigital {
  "xmlns:tfd": string
  "xsi:schemaLocation": string
  Version: string
  UUID: string
  FechaTimbrado: string
  RfcProvCertif: string
  SelloCFD: string
  NoCertificadoSAT: string
  SelloSAT: string
}
