import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TurmaService } from '../../../services/turma.service';
import { DisciplinaService } from '../../../services/disciplina.service';
import { Turma } from '../../../models/aluno.model';
import { Disciplina } from '../../../models/disciplina.model';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-turma-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './turma-form.component.html',
  styleUrls: ['./turma-form.component.scss']
})
export class TurmaFormComponent implements OnInit {
  turma: Turma = {
    nome: '',
    serie: '',
    anoLetivo: new Date().getFullYear()
  };

  loading = false;
  error = '';
  isEditMode = false;
  turmaId: string | null = null;

  // Propriedades para disciplinas
  disciplinas: Disciplina[] = [];
  disciplinasSelecionadas: string[] = [];
  loadingDisciplinas = false;

  series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  anos = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  constructor(
    private turmaService: TurmaService,
    private disciplinaService: DisciplinaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkEditMode();
    this.loadDisciplinas();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.turmaId = id;
      this.loadTurma(this.turmaId);
    }
  }

  private loadTurma(id: string): void {
    this.loading = true;
    this.turmaService.getTurmaById(id).subscribe({
      next: (turma) => {
        this.turma = {
          nome: turma.nome,
          serie: turma.serie,
          anoLetivo: turma.anoLetivo
        };
        
        // Carregar disciplinas já associadas à turma
        if (turma.disciplinasIds && turma.disciplinasIds.length > 0) {
          this.disciplinasSelecionadas = [...turma.disciplinasIds];
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turma:', error);
        this.error = 'Erro ao carregar dados da turma';
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

    if (this.isEditMode && this.turmaId) {
      this.updateTurma();
    } else {
      this.createTurma();
    }
  }

  private createTurma(): void {
    // Adicionar disciplinas selecionadas ao objeto turma
    const turmaComDisciplinas = {
      ...this.turma,
      disciplinasIds: this.disciplinasSelecionadas
    };

    this.turmaService.createTurma(turmaComDisciplinas).subscribe({
      next: (turma) => {
        console.log('✅ Turma criada com sucesso:', turma);
        
        // Se há disciplinas selecionadas, associá-las à turma
        if (this.disciplinasSelecionadas.length > 0 && turma.id) {
          this.associarDisciplinas(turma.id);
        } else {
          this.router.navigate(['/admin/turmas']);
        }
      },
      error: (error) => {
        console.error('❌ Erro ao criar turma:', error);
        this.error = 'Erro ao criar turma';
        this.loading = false;
      }
    });
  }

  private associarDisciplinas(turmaId: string): void {
    const operacoes = this.disciplinasSelecionadas.map(disciplinaId => 
      this.turmaService.adicionarDisciplina(turmaId, disciplinaId)
    );

    Promise.all(operacoes.map(op => op.toPromise())).then(() => {
      console.log('✅ Disciplinas associadas com sucesso');
      this.router.navigate(['/admin/turmas']);
    }).catch((error) => {
      console.error('❌ Erro ao associar disciplinas:', error);
      this.error = 'Turma criada, mas houve erro ao associar disciplinas';
      this.loading = false;
    });
  }

  private updateTurma(): void {
    if (!this.turmaId) return;

    this.turmaService.updateTurma(this.turmaId, this.turma).subscribe({
      next: (turma) => {
        console.log('✅ Turma atualizada com sucesso:', turma);
        
        // Se há disciplinas selecionadas, gerenciar as associações
        if (this.disciplinasSelecionadas.length > 0) {
          this.gerenciarDisciplinasTurma();
        } else {
          this.router.navigate(['/admin/turmas']);
        }
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar turma:', error);
        this.error = 'Erro ao atualizar turma';
        this.loading = false;
      }
    });
  }

  private gerenciarDisciplinasTurma(): void {
    if (!this.turmaId) return;

    // Primeiro, remover todas as disciplinas atuais
    this.turmaService.getTurmaById(this.turmaId).subscribe({
      next: (turmaAtual) => {
        const disciplinasAtuais = turmaAtual.disciplinasIds || [];
        
        // Remover disciplinas que não estão mais selecionadas
        const paraRemover = disciplinasAtuais.filter(id => !this.disciplinasSelecionadas.includes(id));
        
        // Adicionar disciplinas que foram selecionadas
        const paraAdicionar = this.disciplinasSelecionadas.filter(id => !disciplinasAtuais.includes(id));
        
        const operacoes = [
          ...paraRemover.map(id => this.turmaService.removerDisciplina(this.turmaId!, id)),
          ...paraAdicionar.map(id => this.turmaService.adicionarDisciplina(this.turmaId!, id))
        ];

        if (operacoes.length === 0) {
          this.router.navigate(['/admin/turmas']);
          return;
        }

        Promise.all(operacoes.map(op => op.toPromise())).then(() => {
          console.log('✅ Disciplinas atualizadas com sucesso');
          this.router.navigate(['/admin/turmas']);
        }).catch((error) => {
          console.error('❌ Erro ao atualizar disciplinas:', error);
          this.error = 'Turma atualizada, mas houve erro ao atualizar disciplinas';
          this.loading = false;
        });
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turma atual:', error);
        this.router.navigate(['/admin/turmas']);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.turma.nome.trim()) {
      this.error = 'Nome da turma é obrigatório';
      return false;
    }

    if (!this.turma.serie) {
      this.error = 'Série é obrigatória';
      return false;
    }

    if (!this.turma.anoLetivo) {
      this.error = 'Ano letivo é obrigatório';
      return false;
    }

    // Validar se o ano está no futuro ou é o ano atual
    const currentYear = new Date().getFullYear();
    if (this.turma.anoLetivo < currentYear) {
      this.error = 'Ano letivo deve ser o ano atual ou futuro';
      return false;
    }

    this.error = '';
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/turmas']);
  }

  generateTurmaName(): void {
    if (this.turma.serie && this.turma.anoLetivo) {
      this.turma.nome = `${this.turma.serie} ${this.turma.anoLetivo}`;
    }
  }

  // Métodos para gerenciar disciplinas
  loadDisciplinas(): void {
    this.loadingDisciplinas = true;
    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        this.disciplinas = disciplinas;
        this.loadingDisciplinas = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplinas:', error);
        this.loadingDisciplinas = false;
      }
    });
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

  getDisciplinaNome(disciplinaId: string): string {
    const disciplina = this.disciplinas.find(d => d.id === disciplinaId);
    return disciplina ? disciplina.nome : 'Disciplina não encontrada';
  }
}
