import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disciplina, DisciplinaDTO } from '../models/disciplina.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api/disciplinas';

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

  getDisciplinas(): Observable<Disciplina[]> {
    const headers = this.getHeaders();
    console.log('🔑 Headers para disciplinas:', headers);
    console.log('🎫 Token atual:', this.authService.getToken());
    return this.http.get<Disciplina[]>(this.API_URL, { headers });
  }

  getDisciplinaById(id: string): Observable<Disciplina> {
    return this.http.get<Disciplina>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  getDisciplinasByTurma(turmaId: string): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(`${this.API_URL}/turma/${turmaId}`, { headers: this.getHeaders() });
  }

  createDisciplina(disciplina: DisciplinaDTO): Observable<Disciplina> {
    return this.http.post<Disciplina>(this.API_URL, disciplina, { headers: this.getHeaders() });
  }

  updateDisciplina(id: string, disciplina: DisciplinaDTO): Observable<Disciplina> {
    return this.http.put<Disciplina>(`${this.API_URL}/${id}`, disciplina, { headers: this.getHeaders() });
  }

  deleteDisciplina(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
