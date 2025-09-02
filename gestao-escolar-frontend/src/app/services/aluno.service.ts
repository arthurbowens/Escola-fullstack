import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, AlunoDTO } from '../models/aluno.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api/alunos';

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

  getAlunos(): Observable<Aluno[]> {
    const headers = this.getHeaders();
    console.log('🔑 Headers para alunos:', headers);
    console.log('🎫 Token atual:', this.authService.getToken());
    return this.http.get<Aluno[]>(this.API_URL, { headers });
  }

  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  createAluno(aluno: AlunoDTO): Observable<Aluno> {
    return this.http.post<Aluno>(this.API_URL, aluno, { headers: this.getHeaders() });
  }

  updateAluno(id: number, aluno: AlunoDTO): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.API_URL}/${id}`, aluno, { headers: this.getHeaders() });
  }

  deleteAluno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
