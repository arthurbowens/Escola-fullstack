import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor, ProfessorDTO } from '../models/professor.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private apiUrl = 'http://localhost:8080/gestaoEscolar/api/professores';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('🎫 Token atual:', token);
    
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log('🔑 Headers para professores:', headers);
    return headers;
  }

  getProfessores(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getProfessorById(id: string): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProfessor(professor: ProfessorDTO): Observable<Professor> {
    return this.http.post<Professor>(this.apiUrl, professor, { headers: this.getHeaders() });
  }

  updateProfessor(id: string, professor: ProfessorDTO): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/${id}`, professor, { headers: this.getHeaders() });
  }

  deleteProfessor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getProfessorByCpf(cpf: string): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/cpf/${cpf}`, { headers: this.getHeaders() });
  }

  getDisciplinasLecionadas(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/disciplinas`, { headers: this.getHeaders() });
  }

  getProfessorLogado(): Observable<Professor> {
    console.log('👨‍🏫 Buscando dados do professor logado');
    return this.http.get<Professor>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }
}
