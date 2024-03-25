export interface Nomina {
  id : number,
  "xmlns:xsi": string
  "xsi:schemaLocation": string
  "xmlns:cfdi": string
  "xmlns:nomina12": string
  Version: string
  Fecha: string
  Sello: string
  NoCertificado: string
  Certificado: string
  Moneda: string
  TipoDeComprobante: string
  Exportacion: string
  MetodoPago: string
  Serie: string
  Folio: string
  LugarExpedicion: string
  SubTotal: string
  Descuento: string
  Total: string
  "cfdi:Emisor": CfdiEmisor
  "cfdi:Receptor": CfdiReceptor
  "cfdi:Conceptos": CfdiConceptos
  "cfdi:Complemento": CfdiComplemento
}

export interface CfdiEmisor {
  RegimenFiscal: string
  Rfc: string
  Nombre: string
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
  Descripcion: string
  ObjetoImp: string
  ValorUnitario: string
  Importe: string
  Descuento: string
}

export interface CfdiComplemento {
  "nomina12:Nomina": Nomina12Nomina
  "tfd:TimbreFiscalDigital": TfdTimbreFiscalDigital
}

export interface Nomina12Nomina {
  Version: string
  TipoNomina: string
  FechaPago: string
  FechaInicialPago: string
  FechaFinalPago: string
  NumDiasPagados: string
  TotalPercepciones: string
  TotalDeducciones: string
  TotalOtrosPagos: string
  "nomina12:Emisor": Nomina12Emisor
  "nomina12:Receptor": Nomina12Receptor
  "nomina12:Percepciones": Nomina12Percepciones
  "nomina12:Deducciones": Nomina12Deducciones
  "nomina12:OtrosPagos": Nomina12OtrosPagos
}

export interface Nomina12Emisor {
  RegistroPatronal: string
}

export interface Nomina12Receptor {
  Curp: string
  NumSeguridadSocial: string
  FechaInicioRelLaboral: string
  Antigüedad: string
  TipoContrato: string
  Sindicalizado: string
  TipoJornada: string
  TipoRegimen: string
  NumEmpleado: string
  Departamento: string
  Puesto: string
  RiesgoPuesto: string
  PeriodicidadPago: string
  SalarioBaseCotApor: string
  SalarioDiarioIntegrado: string
  ClaveEntFed: string
}

export interface Nomina12Percepciones {
  TotalSueldos: string
  TotalGravado: string
  TotalExento: string
  "nomina12:Percepcion": Nomina12Percepcion
}

export interface Nomina12Percepcion {
  TipoPercepcion: string
  Clave: string
  Concepto: string
  ImporteGravado: string
  ImporteExento: string
}

export interface Nomina12Deducciones {
  TotalOtrasDeducciones: string
  TotalImpuestosRetenidos: string
  "nomina12:Deduccion": Nomina12Deduccion[]
}

export interface Nomina12Deduccion {
  TipoDeduccion: string
  Clave: string
  Concepto: string
  Importe: string
}

export interface Nomina12OtrosPagos {
  "nomina12:OtroPago": Nomina12OtroPago
}

export interface Nomina12OtroPago {
  TipoOtroPago: string
  Clave: string
  Concepto: string
  Importe: string
  "nomina12:SubsidioAlEmpleo": Nomina12SubsidioAlEmpleo
}

export interface Nomina12SubsidioAlEmpleo {
  SubsidioCausado: string
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
