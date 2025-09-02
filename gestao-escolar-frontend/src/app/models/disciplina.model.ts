export interface Disciplina {
  id?: string;
  nome: string;
  cargaHoraria: number;
  professorId?: string;
  professorNome?: string;
}

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

export interface DisciplinaDTO {
  nome: string;
  cargaHoraria: number;
  professorId?: string;
}
