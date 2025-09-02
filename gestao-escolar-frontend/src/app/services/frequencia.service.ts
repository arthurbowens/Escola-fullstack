import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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

@Injectable({
  providedIn: 'root'
})
export class FrequenciaService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getFrequenciasPorAluno(alunoId: string): Observable<Frequencia[]> {
    console.log('📅 Buscando frequências do aluno:', alunoId);
    return this.http.get<Frequencia[]>(`${this.API_URL}/frequencias/aluno/${alunoId}`, {
      headers: this.getHeaders()
    });
  }

  getFrequenciasPorAlunoEDisciplina(alunoId: string, disciplinaId: string): Observable<Frequencia[]> {
    console.log('📅 Buscando frequências do aluno por disciplina:', alunoId, disciplinaId);
    return this.http.get<Frequencia[]>(`${this.API_URL}/frequencias/aluno/${alunoId}/disciplina/${disciplinaId}`, {
      headers: this.getHeaders()
    });
  }

  getPercentualPresenca(alunoId: string, disciplinaId: string): Observable<number> {
    console.log('📅 Calculando percentual de presença:', alunoId, disciplinaId);
    return this.http.get<number>(`${this.API_URL}/frequencias/aluno/${alunoId}/disciplina/${disciplinaId}/percentual`, {
      headers: this.getHeaders()
    });
  }

  getTotalAulas(alunoId: string, disciplinaId: string): Observable<number> {
    console.log('📅 Contando total de aulas:', alunoId, disciplinaId);
    return this.http.get<number>(`${this.API_URL}/frequencias/aluno/${alunoId}/disciplina/${disciplinaId}/total-aulas`, {
      headers: this.getHeaders()
    });
  }

  getPresencas(alunoId: string, disciplinaId: string): Observable<number> {
    console.log('📅 Contando presenças:', alunoId, disciplinaId);
    return this.http.get<number>(`${this.API_URL}/frequencias/aluno/${alunoId}/disciplina/${disciplinaId}/presencas`, {
      headers: this.getHeaders()
    });
  }

  // Método para processar frequências e criar resumo por disciplina
  processarFrequencias(frequencias: Frequencia[]): FrequenciaResumo[] {
    const resumoPorDisciplina = new Map<string, FrequenciaResumo>();

    frequencias.forEach(freq => {
      if (!freq.disciplina) return;

      const disciplinaNome = freq.disciplina.nome;
      
      if (!resumoPorDisciplina.has(disciplinaNome)) {
        resumoPorDisciplina.set(disciplinaNome, {
          disciplina: disciplinaNome,
          totalAulas: 0,
          presencas: 0,
          faltas: 0,
          percentual: 0
        });
      }

      const resumo = resumoPorDisciplina.get(disciplinaNome)!;
      resumo.totalAulas++;
      
      if (freq.presente) {
        resumo.presencas++;
      } else {
        resumo.faltas++;
      }
    });

    // Calcular percentuais
    resumoPorDisciplina.forEach(resumo => {
      if (resumo.totalAulas > 0) {
        resumo.percentual = (resumo.presencas / resumo.totalAulas) * 100;
      }
    });

    return Array.from(resumoPorDisciplina.values());
  }
}
