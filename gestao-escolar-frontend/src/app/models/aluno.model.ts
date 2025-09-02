import { Disciplina } from './disciplina.model';

export interface Aluno {
  id?: string;
  nome: string;
  matricula: string;
  dataNascimento: string;
  email: string;
  senha: string;
  turma?: Turma;
  turmaId?: string;
}

export interface Turma {
  id?: string;
  nome: string;
  anoLetivo: number;
  serie: string;
  alunos?: Aluno[];
  disciplinas?: Disciplina[];
}

export interface AlunoDTO {
  nome: string;
  matricula: string;
  dataNascimento: string;
  email: string;
  senha: string;
  turmaId: string;
}
