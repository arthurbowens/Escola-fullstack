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
  notas?: Nota[];
  frequencias?: Frequencia[];
}

export interface Nota {
  id?: string;
  valor: number;
  tipoAvaliacao: string;
  dataAvaliacao: string;
  observacao?: string;
  disciplina?: {
    id: string;
    nome: string;
    professor?: {
      nome: string;
    };
  };
}

export interface Frequencia {
  id?: string;
  dataAula: string;
  presente: boolean;
  observacao?: string;
  disciplina?: {
    id: string;
    nome: string;
  };
}

export interface FrequenciaResumo {
  disciplina: string;
  totalAulas: number;
  presencas: number;
  faltas: number;
  percentual: number;
}

export interface Turma {
  id?: string;
  nome: string;
  anoLetivo: number;
  serie: string;
  ano?: string; // Adicionando propriedade ano
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
