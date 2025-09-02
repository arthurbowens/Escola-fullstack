export interface Professor {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  disciplinas?: Disciplina[];
}

export interface Disciplina {
  id?: number;
  nome: string;
  cargaHoraria: number;
  professor?: Professor;
  professorId?: number;
}

export interface ProfessorDTO {
  nome: string;
  cpf: string;
  email: string;
}
