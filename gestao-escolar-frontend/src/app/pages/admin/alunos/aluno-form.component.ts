import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../../../services/aluno.service';
import { TurmaService } from '../../../services/turma.service';
import { Aluno, AlunoDTO, Turma } from '../../../models/aluno.model';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './aluno-form.component.html',
  styleUrls: ['./aluno-form.component.scss']
})
export class AlunoFormComponent implements OnInit {
  aluno: AlunoDTO = {
    nome: '',
    matricula: '',
    dataNascimento: '',
    email: '',
    senha: '',
    turmaId: ''
  };

  turmas: Turma[] = [];
  loading = false;
  error = '';
  isEditMode = false;
  alunoId: string | null = null;

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTurmas();
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.alunoId = id;
      this.loadAluno(this.alunoId);
    }
  }

  private loadAluno(id: string): void {
    this.loading = true;
    this.alunoService.getAlunoById(id).subscribe({
      next: (aluno) => {
        this.aluno = {
          nome: aluno.nome,
          matricula: aluno.matricula,
          dataNascimento: aluno.dataNascimento,
          email: aluno.email,
          senha: '', // Senha vazia para edição (não será alterada se não preenchida)
          turmaId: aluno.turmaId || ''
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar aluno:', error);
        this.error = 'Erro ao carregar dados do aluno';
        this.loading = false;
      }
    });
  }

  private loadTurmas(): void {
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        if (turmas.length > 0 && !this.aluno.turmaId) {
          this.aluno.turmaId = turmas[0].id || '';
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turmas:', error);
        this.error = 'Erro ao carregar turmas';
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.alunoId) {
      this.updateAluno();
    } else {
      this.createAluno();
    }
  }

  private createAluno(): void {
    // Converter turmaId em objeto Turma para o backend
    const alunoParaEnviar = {
      ...this.aluno,
      turma: this.aluno.turmaId ? { id: this.aluno.turmaId } : null
    };

    console.log('📤 Enviando aluno para o backend:', alunoParaEnviar);

    this.alunoService.createAluno(alunoParaEnviar).subscribe({
      next: (aluno) => {
        console.log('✅ Aluno criado com sucesso:', aluno);
        this.router.navigate(['/admin/alunos']);
      },
      error: (error) => {
        console.error('❌ Erro ao criar aluno:', error);
        this.error = 'Erro ao criar aluno';
        this.loading = false;
      }
    });
  }

  private updateAluno(): void {
    if (!this.alunoId) return;

    // Converter turmaId em objeto Turma para o backend
    const alunoParaEnviar = {
      ...this.aluno,
      turma: this.aluno.turmaId ? { id: this.aluno.turmaId } : null
    };

    // Se senha estiver vazia, remover do objeto para não alterar a senha atual
    if (!alunoParaEnviar.senha.trim()) {
      const { senha, ...alunoSemSenha } = alunoParaEnviar;
      // Criar objeto compatível com AlunoDTO sem senha
      const alunoParaAtualizacao = {
        nome: alunoSemSenha.nome,
        matricula: alunoSemSenha.matricula,
        dataNascimento: alunoSemSenha.dataNascimento,
        email: alunoSemSenha.email,
        turmaId: alunoSemSenha.turmaId
      } as any; // Usar 'any' para contornar a validação TypeScript
      
      this.alunoService.updateAluno(this.alunoId, alunoParaAtualizacao).subscribe({
        next: (aluno) => {
          console.log('✅ Aluno atualizado com sucesso:', aluno);
          this.router.navigate(['/admin/alunos']);
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar aluno:', error);
          this.error = 'Erro ao atualizar aluno';
          this.loading = false;
        }
      });
      return;
    }

    console.log('📤 Enviando aluno para atualização:', alunoParaEnviar);

    this.alunoService.updateAluno(this.alunoId, alunoParaEnviar).subscribe({
      next: (aluno) => {
        console.log('✅ Aluno atualizado com sucesso:', aluno);
        this.router.navigate(['/admin/alunos']);
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar aluno:', error);
        this.error = 'Erro ao atualizar aluno';
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.aluno.nome.trim()) {
      this.error = 'Nome é obrigatório';
      return false;
    }

    if (!this.aluno.matricula.trim()) {
      this.error = 'Matrícula é obrigatória';
      return false;
    }

    if (!this.aluno.email.trim()) {
      this.error = 'Email é obrigatório';
      return false;
    }

    // Senha é obrigatória apenas para novos alunos
    if (!this.isEditMode && !this.aluno.senha.trim()) {
      this.error = 'Senha é obrigatória';
      return false;
    }

    if (!this.aluno.dataNascimento) {
      this.error = 'Data de nascimento é obrigatória';
      return false;
    }

    if (!this.aluno.turmaId) {
      this.error = 'Turma é obrigatória';
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.aluno.email)) {
      this.error = 'Email inválido';
      return false;
    }

    // Validar tamanho mínimo da senha (apenas se senha foi informada)
    if (this.aluno.senha.trim() && this.aluno.senha.length < 6) {
      this.error = 'Senha deve ter pelo menos 6 caracteres';
      return false;
    }

    this.error = '';
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/alunos']);
  }
}
