// Generated by https://quicktype.io

import { ISkuSmCreate } from "src/app/skus/models/interface";

export interface IMaterialCreate {
  nombre: string;
  desripcion?: string;
  capacidadTamanio: string;
  cantidad: number;
  clasificacion: string;
  fechaIngreso: string;
  status: number;
  unidadMedida: IRelationStringId;
  marca: IRelationStringId;
  tipoMaterial: IRelationNumberId;
  ubicacion: IRelationStringId;
  skus: ISkuSmCreate[];
}

export interface IRelationStringId {
    id: string;
}

export interface IRelationNumberId {
    id: number;
}
