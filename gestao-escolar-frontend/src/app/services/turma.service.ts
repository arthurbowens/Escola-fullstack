import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma } from '../models/aluno.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api/turmas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTurmas(): Observable<Turma[]> {
    const headers = this.getHeaders();
    console.log('🔑 Headers para turmas:', headers);
    console.log('🎫 Token atual:', this.authService.getToken());
    return this.http.get<Turma[]>(this.API_URL, { headers });
  }

  getTurmaById(id: string): Observable<Turma> {
    return this.http.get<Turma>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  getTurmaComDetalhes(id: string): Observable<Turma> {
    return this.http.get<Turma>(`${this.API_URL}/${id}/detalhes`, { headers: this.getHeaders() });
  }

  createTurma(turma: Turma): Observable<Turma> {
    return this.http.post<Turma>(this.API_URL, turma, { headers: this.getHeaders() });
  }

  updateTurma(id: string, turma: Turma): Observable<Turma> {
    return this.http.put<Turma>(`${this.API_URL}/${id}`, turma, { headers: this.getHeaders() });
  }

  deleteTurma(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
