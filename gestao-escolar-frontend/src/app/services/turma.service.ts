import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api/turmas';

  constructor(private http: HttpClient) {}

  getTurmas(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.API_URL);
  }

  getTurmaById(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.API_URL}/${id}`);
  }

  createTurma(turma: Turma): Observable<Turma> {
    return this.http.post<Turma>(this.API_URL, turma);
  }

  updateTurma(id: number, turma: Turma): Observable<Turma> {
    return this.http.put<Turma>(`${this.API_URL}/${id}`, turma);
  }

  deleteTurma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
