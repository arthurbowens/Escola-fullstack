export interface Aluno {
  id?: number;
  nome: string;
  matricula: string;
  dataNascimento: string;
  email: string;
  senha: string;
  turma?: Turma;
  turmaId?: number;
}

export interface Turma {
  id?: number;
  nome: string;
  anoLetivo: number;
  serie: string;
}

export interface AlunoDTO {
  nome: string;
  matricula: string;
  dataNascimento: string;
  email: string;
  senha: string;
  turmaId: number;
}
