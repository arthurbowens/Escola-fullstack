export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  tipoUsuario: TipoUsuario;
}

export enum TipoUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  PROFESSOR = 'PROFESSOR',
  ALUNO = 'ALUNO'
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  tipoUsuario: TipoUsuario;
}
