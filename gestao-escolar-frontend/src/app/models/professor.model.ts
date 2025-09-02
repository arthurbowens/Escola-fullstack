import { Disciplina } from './disciplina.model';

export interface Professor {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  dataNascimento?: string;
  formacaoAcademica?: string;
  telefone?: string;
  disciplinas?: Disciplina[];
}

export interface ProfessorDTO {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  dataNascimento: string;
  formacaoAcademica?: string;
  telefone?: string;
  disciplinasIds?: string[];
}
