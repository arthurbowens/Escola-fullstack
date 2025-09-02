export interface Professor {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  disciplinas?: Disciplina[];
}

export interface Disciplina {
  id?: string;
  nome: string;
  cargaHoraria: number;
  professor?: Professor;
  professorId?: string;
}

export interface ProfessorDTO {
  nome: string;
  cpf: string;
  email: string;
}
