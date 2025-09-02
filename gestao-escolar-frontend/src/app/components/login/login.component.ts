import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    senha: ''
  };
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('🔐 Tentativa de login iniciada');
    console.log('📧 Email:', this.credentials.email);
    console.log('🔑 Senha:', this.credentials.senha);
    
    if (!this.credentials.email || !this.credentials.senha) {
      this.error = 'Por favor, preencha todos os campos';
      console.log('❌ Campos vazios detectados');
      return;
    }

    this.loading = true;
    this.error = '';
    console.log('🚀 Fazendo requisição para o backend...');

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Login bem-sucedido!', response);
        this.loading = false;
        this.redirectBasedOnUserType(response.usuario.tipoUsuario);
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = 'Erro de conexão: Verifique se o backend está rodando';
        } else if (err.status === 401) {
          this.error = 'Email ou senha inválidos';
        } else if (err.status === 404) {
          this.error = 'Endpoint não encontrado: Verifique a URL da API';
        } else {
          this.error = `Erro ${err.status}: ${err.message || 'Erro desconhecido'}`;
        }
      }
    });
  }

  private redirectBasedOnUserType(tipoUsuario: string): void {
    console.log('🔄 Redirecionando para:', tipoUsuario);
    switch (tipoUsuario) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/admin']);
        break;
      case 'PROFESSOR':
        this.router.navigate(['/professor']);
        break;
      case 'ALUNO':
        this.router.navigate(['/aluno']);
        break;
      default:
        console.log('⚠️ Tipo de usuário desconhecido:', tipoUsuario);
        this.router.navigate(['/']);
    }
  }
}
