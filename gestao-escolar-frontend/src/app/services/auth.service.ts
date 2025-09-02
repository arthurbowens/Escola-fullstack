import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Usuario, LoginRequest, LoginResponse, TipoUsuario } from '../models/usuario.model';

interface JwtPayload {
  sub: string; // email
  tipoUsuario: string;
  iat: number;
  exp: number;
}

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
          
          // Decodificar o JWT para obter informações do usuário
          const payload = jwtDecode<JwtPayload>(token);
          console.log('🔍 Payload do JWT:', payload);
          
          // Criar usuário baseado no JWT
          const user: Usuario = {
            id: payload.sub, // Usar email como ID temporário
            nome: credentials.email.split('@')[0], // Usar parte do email como nome
            email: payload.sub,
            tipoUsuario: payload.tipoUsuario as TipoUsuario
          };
          
          console.log('👤 Usuário criado:', user);
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }),
        map(token => {
          // Decodificar o JWT para obter informações do usuário
          const payload = jwtDecode<JwtPayload>(token);
          
          // Criar usuário baseado no JWT
          const user: Usuario = {
            id: payload.sub,
            nome: credentials.email.split('@')[0],
            email: payload.sub,
            tipoUsuario: payload.tipoUsuario as TipoUsuario
          };
          
          return {
            token: token,
            usuario: user,
            tipoUsuario: payload.tipoUsuario as TipoUsuario
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
