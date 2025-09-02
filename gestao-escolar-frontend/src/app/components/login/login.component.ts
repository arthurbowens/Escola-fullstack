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
    if (!this.credentials.email || !this.credentials.senha) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.redirectBasedOnUserType(response.usuario.tipoUsuario);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Email ou senha inválidos';
        console.error('Erro no login:', err);
      }
    });
  }

  private redirectBasedOnUserType(tipoUsuario: string): void {
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
        this.router.navigate(['/']);
    }
  }
}
