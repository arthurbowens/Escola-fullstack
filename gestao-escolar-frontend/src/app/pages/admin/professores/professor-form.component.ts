import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProfessorService } from '../../../services/professor.service';
import { DisciplinaService } from '../../../services/disciplina.service';
import { Professor, ProfessorDTO } from '../../../models/professor.model';
import { Disciplina } from '../../../models/disciplina.model';

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
    telefone: '',
    disciplinasIds: []
  };

  loading = false;
  error = '';
  isEditMode = false;
  professorId: string | null = null;
  disciplinas: Disciplina[] = [];
  disciplinasSelecionadas: string[] = [];

  formacoes = [
    'Graduação',
    'Especialização',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado'
  ];

  constructor(
    private professorService: ProfessorService,
    private disciplinaService: DisciplinaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎓 Componente ProfessorFormComponent inicializado');
    // Por enquanto, apenas para criar novos professores
    this.isEditMode = false;
    this.loadDisciplinas();
  }

  loadDisciplinas(): void {
    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        this.disciplinas = disciplinas || [];
        console.log('📚 Disciplinas carregadas:', disciplinas);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplinas:', error);
        // Se for erro 404 ou similar, tratar como estado vazio
        if (error.status === 404 || error.status === 403) {
          this.disciplinas = [];
        }
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Adicionar disciplinas selecionadas ao professor
    this.professor.disciplinasIds = this.disciplinasSelecionadas;

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

    // Validar se pelo menos uma disciplina foi selecionada
    if (this.disciplinasSelecionadas.length === 0) {
      this.error = 'Selecione pelo menos uma disciplina';
      return false;
    }

    this.error = '';
    return true;
  }

  toggleDisciplina(disciplinaId: string): void {
    const index = this.disciplinasSelecionadas.indexOf(disciplinaId);
    if (index > -1) {
      this.disciplinasSelecionadas.splice(index, 1);
    } else {
      this.disciplinasSelecionadas.push(disciplinaId);
    }
  }

  isDisciplinaSelecionada(disciplinaId: string): boolean {
    return this.disciplinasSelecionadas.includes(disciplinaId);
  }

  getDisciplinasSelecionadas(): Disciplina[] {
    return this.disciplinas.filter(d => this.disciplinasSelecionadas.includes(d.id!));
  }

  cancel(): void {
    this.router.navigate(['/admin/professores']);
  }
}
