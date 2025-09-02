import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
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
    
    // O backend retorna apenas o token como string pura
    return this.http.post(`${this.API_URL}/auth/login`, credentials, { 
      responseType: 'text' 
    })
      .pipe(
        tap(token => {
          console.log('🎫 Token recebido do backend:', token);
          console.log('🎫 Tipo do token:', typeof token);
          
          // Criar usuário mock baseado no email
          const mockUser: Usuario = {
            id: '1',
            nome: credentials.email.split('@')[0], // Usar parte do email como nome
            email: credentials.email,
            tipoUsuario: TipoUsuario.ADMINISTRADOR // Assumir que é admin por enquanto
          };
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
          }
          this.currentUserSubject.next(mockUser);
        }),
        map(token => {
          // O token já é uma string pura
          
          // Retornar objeto LoginResponse compatível
          const mockUser: Usuario = {
            id: '1',
            nome: credentials.email.split('@')[0],
            email: credentials.email,
            tipoUsuario: TipoUsuario.ADMINISTRADOR
          };
          
          return {
            token: token,
            usuario: mockUser,
            tipoUsuario: TipoUsuario.ADMINISTRADOR
          };
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
