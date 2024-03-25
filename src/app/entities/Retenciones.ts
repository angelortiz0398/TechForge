export interface Retenciones {
  id : number,
  "xmlns:retenciones": string
  "xmlns:xsi": string
  "xmlns:plataformasTecnologicas": string
  "xsi:schemaLocation": string
  Version: string
  FolioInt: string
  FechaExp: string
  CveRetenc: string
  LugarExpRetenc: string
  Certificado: string
  NoCertificado: string
  Sello: string
  "retenciones:Emisor": RetencionesEmisor
  "retenciones:Receptor": RetencionesReceptor
  "retenciones:Periodo": RetencionesPeriodo
  "retenciones:Totales": RetencionesTotales
  "retenciones:Complemento": RetencionesComplemento
}

export interface RetencionesEmisor {
  RfcE: string
  NomDenRazSocE: string
  RegimenFiscalE: string
}

export interface RetencionesReceptor {
  NacionalidadR: string
  "retenciones:Nacional": RetencionesNacional
}

export interface RetencionesNacional {
  RfcR: string
  NomDenRazSocR: string
  DomicilioFiscalR: string
}

export interface RetencionesPeriodo {
  MesIni: string
  MesFin: string
  Ejercicio: string
}

export interface RetencionesTotales {
  MontoTotOperacion: string
  MontoTotGrav: string
  MontoTotExent: string
  MontoTotRet: string
  "retenciones:ImpRetenidos": ImpRetenido[]
}

export interface ImpRetenido {
  BaseRet: string
  ImpuestoRet: string
  MontoRet: string
  TipoPagoRet: string
}

export interface RetencionesComplemento {
  "plataformasTecnologicas:ServiciosPlataformasTecnologicas": PlataformasTecnologicasServiciosPlataformasTecnologicas
  "tfd:TimbreFiscalDigital": TfdTimbreFiscalDigital
}

export interface PlataformasTecnologicasServiciosPlataformasTecnologicas {
  Version: string
  Periodicidad: string
  NumServ: string
  MonTotServSIVA: string
  TotalIVATrasladado: string
  TotalIVARetenido: string
  TotalISRRetenido: string
  DifIVAEntregadoPrestServ: string
  MonTotalporUsoPlataforma: string
  "plataformasTecnologicas:Servicios": PlataformasTecnologicasServicios
}

export interface PlataformasTecnologicasServicios {
  "plataformasTecnologicas:DetallesDelServicio": PlataformasTecnologicasDetallesDelServicio[]
}

export interface PlataformasTecnologicasDetallesDelServicio {
  FormaPagoServ: string
  TipoDeServ: string
  SubTipServ: string
  FechaServ: string
  PrecioServSinIVA: string
  "plataformasTecnologicas:ImpuestosTrasladadosdelServicio"?: PlataformasTecnologicasImpuestosTrasladadosdelServicio
  "plataformasTecnologicas:ComisionDelServicio"?: PlataformasTecnologicasComisionDelServicio
}

export interface PlataformasTecnologicasImpuestosTrasladadosdelServicio {
  Base: string
  Impuesto: string
  TipoFactor: string
  TasaCuota: string
  Importe: string
}

export interface PlataformasTecnologicasComisionDelServicio {
  Importe: string
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
