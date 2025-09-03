import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  aluno?: {
    id: string;
    nome: string;
  };
}

export interface NotaDTO {
  id?: string;
  alunoId?: string;
  disciplinaId?: string;
  disciplinaNome?: string;
  valor: number;
  tipoAvaliacao: string;
  dataAvaliacao: string;
  observacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotaService {
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

  getNotasPorAluno(alunoId: string): Observable<NotaDTO[]> {
    console.log('📊 Buscando notas do aluno:', alunoId);
    return this.http.get<NotaDTO[]>(`${this.API_URL}/notas/aluno/${alunoId}`, {
      headers: this.getHeaders()
    });
  }

  getNotasPorAlunoEDisciplina(alunoId: string, disciplinaId: string): Observable<NotaDTO[]> {
    console.log('📊 Buscando notas do aluno por disciplina:', alunoId, disciplinaId);
    return this.http.get<NotaDTO[]>(`${this.API_URL}/notas/aluno/${alunoId}/disciplina/${disciplinaId}`, {
      headers: this.getHeaders()
    });
  }

  getMediaPorDisciplina(alunoId: string, disciplinaId: string): Observable<number> {
    console.log('📊 Calculando média por disciplina:', alunoId, disciplinaId);
    return this.http.get<number>(`${this.API_URL}/notas/aluno/${alunoId}/disciplina/${disciplinaId}/media`, {
      headers: this.getHeaders()
    });
  }

  createNota(nota: Nota): Observable<NotaDTO> {
    console.log('📊 Criando nota:', nota);
    
    // Converter Nota para NotaDTO
    const notaDTO: NotaDTO = {
      alunoId: nota.aluno?.id,
      disciplinaId: nota.disciplina?.id,
      valor: nota.valor,
      tipoAvaliacao: nota.tipoAvaliacao,
      dataAvaliacao: nota.dataAvaliacao,
      observacao: nota.observacao
    };
    
    return this.http.post<NotaDTO>(`${this.API_URL}/notas`, notaDTO, {
      headers: this.getHeaders()
    });
  }

  updateNota(id: string, nota: Nota): Observable<Nota> {
    console.log('📊 Atualizando nota:', id, nota);
    return this.http.put<Nota>(`${this.API_URL}/notas/${id}`, nota, {
      headers: this.getHeaders()
    });
  }

  deleteNota(id: string): Observable<void> {
    console.log('📊 Deletando nota:', id);
    return this.http.delete<void>(`${this.API_URL}/notas/${id}`, {
      headers: this.getHeaders()
    });
  }
}
