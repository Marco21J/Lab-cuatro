import { IUsuarioCreate } from './usuario-create.interface';

export interface IUsuarioEdit extends Partial<Omit<IUsuarioCreate, 'contrasena'>> {}
