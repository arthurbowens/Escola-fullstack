import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Usuario, LoginRequest, LoginResponse, TipoUsuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/gestaoEscolar/api';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔗 Fazendo requisição para:', `${this.API_URL}/auth/login`);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('✅ Resposta do backend:', response);
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          }
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getTipoUsuario(): TipoUsuario | null {
    const user = this.getCurrentUser();
    return user ? user.tipoUsuario : null;
  }

  isAdmin(): boolean {
    return this.getTipoUsuario() === TipoUsuario.ADMINISTRADOR;
  }

  isProfessor(): boolean {
    return this.getTipoUsuario() === TipoUsuario.PROFESSOR;
  }

  isAluno(): boolean {
    return this.getTipoUsuario() === TipoUsuario.ALUNO;
  }
}
