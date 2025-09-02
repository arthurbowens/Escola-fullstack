import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  @Input() userType: 'aluno' | 'professor' = 'aluno';
  @Output() passwordChanged = new EventEmitter<boolean>();

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = false;

  constructor(
    private authService: AuthService,
    private alunoService: AlunoService,
    private professorService: ProfessorService
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Usuário não encontrado';
      this.loading = false;
      return;
    }

    // Por enquanto, vamos simular a alteração de senha
    // Em uma implementação real, você faria uma chamada para o backend
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      this.resetForm();
      this.passwordChanged.emit(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        this.success = false;
      }, 3000);
    }, 1000);
  }

  private validateForm(): boolean {
    if (!this.currentPassword) {
      this.error = 'Senha atual é obrigatória';
      return false;
    }

    if (!this.newPassword) {
      this.error = 'Nova senha é obrigatória';
      return false;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Nova senha deve ter pelo menos 6 caracteres';
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Confirmação de senha não confere';
      return false;
    }

    if (this.currentPassword === this.newPassword) {
      this.error = 'Nova senha deve ser diferente da senha atual';
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closeModal(): void {
    this.resetForm();
    this.error = '';
    this.success = false;
    this.passwordChanged.emit(false);
  }
}
