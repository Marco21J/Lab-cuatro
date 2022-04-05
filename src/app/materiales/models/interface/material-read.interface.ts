// Generated by https://quicktype.io

import { IMarcaRead } from "src/app/marcas/models/interface";
import { ISkuRead } from "src/app/skus/models/interface";
import { ITipoMaterialRead } from "src/app/tipo-material/models/interface";
import { IUbicacionRead } from "src/app/ubicaciones/models/interface";
import { IUnidadMedidaRead } from "src/app/unidades-medida/models/interface";

export interface IMaterialRead {
  id: string;
  nombre: string;
  desripcion?: string;
  capacidadTamanio: string;
  cantidad: number;
  clasificacion: string;
  fechaIngreso: string;
  status: number;
  unidadMedida: IUnidadMedidaRead;
  marca: IMarcaRead;
  tipoMaterial: ITipoMaterialRead;
  ubicacion: IUbicacionRead;
  skus: ISkuRead[];
}
