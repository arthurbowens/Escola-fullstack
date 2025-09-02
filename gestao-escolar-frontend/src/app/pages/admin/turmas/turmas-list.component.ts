import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TurmaService } from '../../../services/turma.service';
import { AlunoService } from '../../../services/aluno.service';
import { DisciplinaService } from '../../../services/disciplina.service';
import { AlertService } from '../../../services/alert.service';
import { Turma, Aluno } from '../../../models/aluno.model';
import { Disciplina } from '../../../models/professor.model';

@Component({
  selector: 'app-turmas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './turmas-list.component.html',
  styleUrls: ['./turmas-list.component.scss']
})
export class TurmasListComponent implements OnInit {
  turmas: Turma[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedSerie: string = '';
  selectedAno: number | null = null;

  // Propriedades para modal de detalhes
  showDetailsModal = false;
  selectedTurma: Turma | null = null;
  turmaAlunos: Aluno[] = [];
  turmaDisciplinas: Disciplina[] = [];
  loadingDetails = false;

  series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  anos = [2024, 2025, 2026, 2027, 2028];

  constructor(
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private disciplinaService: DisciplinaService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadTurmas();
  }

  loadTurmas(): void {
    this.loading = true;
    this.error = '';

    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.loading = false;
        console.log('✅ Turmas carregadas:', turmas);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turmas:', error);
        this.error = 'Erro ao carregar turmas';
        this.loading = false;
      }
    });
  }

  async deleteTurma(id: string): Promise<void> {
    const turma = this.turmas.find(t => t.id === id);
    const nomeTurma = turma ? turma.nome : 'esta turma';
    
    const confirmed = await this.alertService.confirmDelete(
      'Excluir Turma',
      `Tem certeza que deseja excluir ${nomeTurma}? Esta ação não pode ser desfeita e todos os alunos desta turma serão afetados.`,
      'Sim, excluir!'
    );

    if (confirmed) {
      this.alertService.loading('Excluindo...', 'Removendo turma do sistema');
      
      this.turmaService.deleteTurma(id).subscribe({
        next: () => {
          this.alertService.closeLoading();
          this.alertService.success(
            'Turma Excluída!',
            `${nomeTurma} foi removida do sistema com sucesso.`
          );
          this.loadTurmas(); // Recarregar lista
        },
        error: (error) => {
          this.alertService.closeLoading();
          console.error('❌ Erro ao excluir turma:', error);
          this.alertService.error(
            'Erro ao Excluir',
            'Não foi possível excluir a turma. Tente novamente.'
          );
        }
      });
    }
  }

  get filteredTurmas(): Turma[] {
    let filtered = this.turmas;

    // Filtrar por termo de busca
    if (this.searchTerm) {
      filtered = filtered.filter(turma =>
        turma.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        turma.serie.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por série
    if (this.selectedSerie) {
      filtered = filtered.filter(turma => turma.serie === this.selectedSerie);
    }

    // Filtrar por ano
    if (this.selectedAno) {
      filtered = filtered.filter(turma => turma.anoLetivo === this.selectedAno);
    }

    return filtered;
  }

  getTotalAlunos(turmaId: string): number {
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma?.alunos?.length || 0;
  }

  getTotalDisciplinas(turmaId: string): number {
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma?.disciplinas?.length || 0;
  }

  showTurmaDetails(turma: Turma): void {
    this.selectedTurma = turma;
    this.showDetailsModal = true;
    this.loadingDetails = true;
    
    // Buscar alunos da turma
    this.alunoService.getAlunos().subscribe({
      next: (alunos) => {
        this.turmaAlunos = alunos.filter(aluno => aluno.turmaId === turma.id);
        this.loadingDetails = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar alunos:', error);
        this.turmaAlunos = [];
        this.loadingDetails = false;
      }
    });

    // Buscar disciplinas da turma
    this.disciplinaService.getDisciplinasByTurma(turma.id!).subscribe({
      next: (disciplinas) => {
        this.turmaDisciplinas = disciplinas;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplinas:', error);
        this.turmaDisciplinas = [];
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedTurma = null;
    this.turmaAlunos = [];
    this.turmaDisciplinas = [];
  }

  limparFiltros(): void {
    this.searchTerm = '';
    this.selectedSerie = '';
    this.selectedAno = null;
  }
}
