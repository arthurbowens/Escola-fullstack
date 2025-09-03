import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DisciplinaService } from '../../../services/disciplina.service';
import { TurmaService } from '../../../services/turma.service';
import { ProfessorService } from '../../../services/professor.service';
import { Disciplina, DisciplinaDTO } from '../../../models/disciplina.model';
import { Turma } from '../../../models/aluno.model';
import { Professor } from '../../../models/professor.model';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-disciplina-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './disciplina-form.component.html',
  styleUrls: ['./disciplina-form.component.scss']
})
export class DisciplinaFormComponent implements OnInit {
  disciplina: DisciplinaDTO = {
    nome: '',
    cargaHoraria: 0
  };

  loading = false;
  error = '';
  isEditMode = false;
  disciplinaId: string | null = null;

  // Propriedades para turmas
  turmas: Turma[] = [];
  turmasSelecionadas: string[] = [];
  loadingTurmas = false;

  // Propriedades para professores
  professores: Professor[] = [];
  loadingProfessores = false;

  constructor(
    private disciplinaService: DisciplinaService,
    private turmaService: TurmaService,
    private professorService: ProfessorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.disciplinaId = id;
      this.loadDisciplina(id);
    } else {
      this.isEditMode = false;
    }
    this.loadTurmas();
    this.loadProfessores();
  }

  private loadDisciplina(id: string): void {
    this.loading = true;
    this.error = '';

    this.disciplinaService.getDisciplinaById(id).subscribe({
      next: (disciplina) => {
        this.disciplina = {
          nome: disciplina.nome,
          cargaHoraria: disciplina.cargaHoraria,
          professorId: disciplina.professorId
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplina:', error);
        this.error = 'Erro ao carregar disciplina. Tente novamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.disciplinaId) {
      this.disciplinaService.updateDisciplina(this.disciplinaId, this.disciplina).subscribe({
        next: (disciplina) => {
          console.log('✅ Disciplina atualizada com sucesso:', disciplina);
          this.router.navigate(['/admin/disciplinas']);
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar disciplina:', error);
          this.error = 'Erro ao atualizar disciplina. Tente novamente.';
          this.loading = false;
        }
      });
    } else {
      this.disciplinaService.createDisciplina(this.disciplina).subscribe({
        next: (disciplina) => {
          console.log('✅ Disciplina criada com sucesso:', disciplina);
          
          // Se há turmas selecionadas, associá-las à disciplina
          if (this.turmasSelecionadas.length > 0 && disciplina.id) {
            this.associarTurmas(disciplina.id);
          } else {
            this.router.navigate(['/admin/disciplinas']);
          }
        },
        error: (error) => {
          console.error('❌ Erro ao criar disciplina:', error);
          this.error = 'Erro ao criar disciplina. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  private associarTurmas(disciplinaId: string): void {
    const operacoes = this.turmasSelecionadas.map(turmaId => 
      this.turmaService.adicionarDisciplina(turmaId, disciplinaId)
    );

    Promise.all(operacoes.map(op => op.toPromise())).then(() => {
      console.log('✅ Turmas associadas com sucesso');
      this.router.navigate(['/admin/disciplinas']);
    }).catch((error) => {
      console.error('❌ Erro ao associar turmas:', error);
      this.error = 'Disciplina criada, mas houve erro ao associar turmas';
      this.loading = false;
    });
  }

  private validateForm(): boolean {
    if (!this.disciplina.nome.trim()) {
      this.error = 'Nome da disciplina é obrigatório';
      return false;
    }

    if (!this.disciplina.cargaHoraria || this.disciplina.cargaHoraria <= 0) {
      this.error = 'Carga horária deve ser maior que zero';
      return false;
    }

    if (this.disciplina.cargaHoraria > 200) {
      this.error = 'Carga horária não pode ser maior que 200 horas';
      return false;
    }

    this.error = '';
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/disciplinas']);
  }

  // Métodos para gerenciar turmas
  loadTurmas(): void {
    this.loadingTurmas = true;
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.loadingTurmas = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turmas:', error);
        this.loadingTurmas = false;
      }
    });
  }

  toggleTurma(turmaId: string): void {
    const index = this.turmasSelecionadas.indexOf(turmaId);
    if (index > -1) {
      this.turmasSelecionadas.splice(index, 1);
    } else {
      this.turmasSelecionadas.push(turmaId);
    }
  }

  isTurmaSelecionada(turmaId: string): boolean {
    return this.turmasSelecionadas.includes(turmaId);
  }

  getTurmaNome(turmaId: string): string {
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma ? turma.nome : 'Turma não encontrada';
  }

  getTotalAlunos(turmaId: string): number {
    const turma = this.turmas.find(t => t.id === turmaId);
    if (turma?.alunos && turma.alunos.length > 0) {
      return turma.alunos.length;
    }
    if (turma?.alunosIds && turma.alunosIds.length > 0) {
      return turma.alunosIds.length;
    }
    if (turma?.alunosNomes && turma.alunosNomes.length > 0) {
      return turma.alunosNomes.length;
    }
    return 0;
  }

  // Métodos para gerenciar professores
  loadProfessores(): void {
    this.loadingProfessores = true;
    this.professorService.getProfessores().subscribe({
      next: (professores) => {
        this.professores = professores;
        this.loadingProfessores = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar professores:', error);
        this.loadingProfessores = false;
      }
    });
  }

  getProfessorNome(professorId: string): string {
    const professor = this.professores.find(p => p.id === professorId);
    return professor ? professor.nome : 'Professor não encontrado';
  }
}
