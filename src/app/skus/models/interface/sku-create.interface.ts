// Generated by https://quicktype.io

export interface ISkuSmCreate {
  valor: string;
  desripcion: string;
}

// Generated by https://quicktype.io

export interface ISkuCreate {
  valor: string;
  desripcion?: string;
  reactivo?: ISkuRealtionId;
  material?: ISkuRealtionId;
}

export interface ISkuRealtionId {
  id: string;
}
