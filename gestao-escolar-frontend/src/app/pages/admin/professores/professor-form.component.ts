import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProfessorService } from '../../../services/professor.service';
import { Professor, ProfessorDTO } from '../../../models/professor.model';

@Component({
  selector: 'app-professor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.scss']
})
export class ProfessorFormComponent implements OnInit {
  professor: ProfessorDTO = {
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    dataNascimento: '',
    formacaoAcademica: '',
    telefone: ''
  };

  loading = false;
  error = '';
  isEditMode = false;
  professorId: string | null = null;

  formacoes = [
    'Graduação',
    'Especialização',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado'
  ];

  constructor(
    private professorService: ProfessorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎓 Componente ProfessorFormComponent inicializado');
    // Por enquanto, apenas para criar novos professores
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.professorService.createProfessor(this.professor).subscribe({
      next: (professor) => {
        console.log('✅ Professor criado com sucesso:', professor);
        this.router.navigate(['/admin/professores']);
      },
      error: (error) => {
        console.error('❌ Erro ao criar professor:', error);
        this.error = 'Erro ao criar professor';
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.professor.nome.trim()) {
      this.error = 'Nome do professor é obrigatório';
      return false;
    }

    if (!this.professor.cpf.trim()) {
      this.error = 'CPF é obrigatório';
      return false;
    }

    if (!this.professor.email.trim()) {
      this.error = 'Email é obrigatório';
      return false;
    }

    if (!this.professor.senha.trim()) {
      this.error = 'Senha é obrigatória';
      return false;
    }

    if (!this.professor.dataNascimento.trim()) {
      this.error = 'Data de nascimento é obrigatória';
      return false;
    }

    // Validar se a senha tem pelo menos 6 caracteres
    if (this.professor.senha.length < 6) {
      this.error = 'A senha deve ter pelo menos 6 caracteres';
      return false;
    }

    this.error = '';
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/professores']);
  }
}
