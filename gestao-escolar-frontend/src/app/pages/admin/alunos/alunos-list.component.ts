import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlunoService } from '../../../services/aluno.service';
import { TurmaService } from '../../../services/turma.service';
import { Aluno, Turma } from '../../../models/aluno.model';

@Component({
  selector: 'app-alunos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './alunos-list.component.html',
  styleUrls: ['./alunos-list.component.scss']
})
export class AlunosListComponent implements OnInit {
  alunos: Aluno[] = [];
  turmas: Turma[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedTurma: number | null = null;

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService
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
        this.alunos = alunos;
        this.loading = false;
        console.log('✅ Alunos carregados:', alunos);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar alunos:', error);
        this.error = 'Erro ao carregar alunos';
        this.loading = false;
      }
    });
  }

  loadTurmas(): void {
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        console.log('✅ Turmas carregadas:', turmas);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turmas:', error);
      }
    });
  }

  deleteAluno(id: number): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.alunoService.deleteAluno(id).subscribe({
        next: () => {
          console.log('✅ Aluno excluído com sucesso');
          this.loadAlunos(); // Recarregar lista
        },
        error: (error) => {
          console.error('❌ Erro ao excluir aluno:', error);
          this.error = 'Erro ao excluir aluno';
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

  getTurmaNome(turmaId: number | undefined): string {
    if (!turmaId) return 'N/A';
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma ? turma.nome : 'N/A';
  }

  formatarData(data: string): string {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
