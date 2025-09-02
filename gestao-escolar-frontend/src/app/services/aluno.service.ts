import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, AlunoDTO } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api/alunos';

  constructor(private http: HttpClient) {}

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.API_URL);
  }

  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.API_URL}/${id}`);
  }

  createAluno(aluno: AlunoDTO): Observable<Aluno> {
    return this.http.post<Aluno>(this.API_URL, aluno);
  }

  updateAluno(id: number, aluno: AlunoDTO): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.API_URL}/${id}`, aluno);
  }

  deleteAluno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
