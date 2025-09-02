import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlunoService } from '../../../services/aluno.service';
import { TurmaService } from '../../../services/turma.service';
import { AlertService } from '../../../services/alert.service';
import { Aluno, Turma } from '../../../models/aluno.model';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-alunos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './alunos-list.component.html',
  styleUrls: ['./alunos-list.component.scss']
})
export class AlunosListComponent implements OnInit {
  alunos: Aluno[] = [];
  turmas: Turma[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedTurma: string | null = null;

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadAlunos();
    this.loadTurmas();
  }

  loadAlunos(): void {
    this.loading = true;
    this.error = '';

    this.alunoService.getAlunos().subscribe({
      next: (alunos) => {
        this.alunos = alunos || [];
        this.loading = false;
        console.log('✅ Alunos carregados:', alunos);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar alunos:', error);
        // Se for erro 404 ou similar, tratar como estado vazio
        if (error.status === 404 || error.status === 403) {
          this.alunos = [];
          this.error = '';
        } else {
          this.error = 'Erro ao carregar alunos. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }

  loadTurmas(): void {
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas || [];
        console.log('✅ Turmas carregadas:', turmas);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turmas:', error);
        // Se for erro 404 ou similar, tratar como estado vazio
        if (error.status === 404 || error.status === 403) {
          this.turmas = [];
        }
      }
    });
  }

  async deleteAluno(id: string): Promise<void> {
    const aluno = this.alunos.find(a => a.id === id);
    const nomeAluno = aluno ? aluno.nome : 'este aluno';
    
    const confirmed = await this.alertService.confirmDelete(
      'Excluir Aluno',
      `Tem certeza que deseja excluir ${nomeAluno}? Esta ação não pode ser desfeita.`,
      'Sim, excluir!'
    );

    if (confirmed) {
      this.alertService.loading('Excluindo...', 'Removendo aluno do sistema');
      
      this.alunoService.deleteAluno(id).subscribe({
        next: () => {
          this.alertService.closeLoading();
          this.alertService.success(
            'Aluno Excluído!',
            `${nomeAluno} foi removido do sistema com sucesso.`
          );
          this.loadAlunos(); // Recarregar lista
        },
        error: (error) => {
          this.alertService.closeLoading();
          console.error('❌ Erro ao excluir aluno:', error);
          this.alertService.error(
            'Erro ao Excluir',
            'Não foi possível excluir o aluno. Tente novamente.'
          );
        }
      });
    }
  }

  get filteredAlunos(): Aluno[] {
    let filtered = this.alunos;

    // Filtrar por termo de busca
    if (this.searchTerm) {
      filtered = filtered.filter(aluno =>
        aluno.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        aluno.matricula.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        aluno.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por turma
    if (this.selectedTurma) {
      filtered = filtered.filter(aluno => aluno.turmaId === this.selectedTurma);
    }

    return filtered;
  }

  getTurmaNome(turmaId: string | undefined): string {
    if (!turmaId) return 'N/A';
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma ? turma.nome : 'N/A';
  }

  formatarData(data: string): string {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
