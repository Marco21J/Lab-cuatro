// Generated by https://quicktype.io

export interface ILoginResponse {
  accessToken: string;
  id: string;
  nombre: string;
  email: string;
  refreshToken: string;
  rol: ILoginRol;
}

export interface ILoginRol {
  id: number;
}