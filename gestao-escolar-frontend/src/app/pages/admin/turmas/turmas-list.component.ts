import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TurmaService } from '../../../services/turma.service';
import { AlunoService } from '../../../services/aluno.service';
import { DisciplinaService } from '../../../services/disciplina.service';
import { AlertService } from '../../../services/alert.service';
import { Turma, Aluno } from '../../../models/aluno.model';
import { Disciplina } from '../../../models/disciplina.model';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-turmas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
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

  // Propriedades para modal de gerenciamento de disciplinas
  showDisciplinasModal = false;
  disciplinasDisponiveis: Disciplina[] = [];
  disciplinasSelecionadas: string[] = [];
  loadingDisciplinas = false;

  series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  anos = [2024, 2025, 2026, 2027, 2028];

  constructor(
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private disciplinaService: DisciplinaService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTurmas();
  }

  loadTurmas(): void {
    this.loading = true;
    this.error = '';

    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas || [];
        this.loading = false;
        console.log('✅ Turmas carregadas:', turmas.map(t => ({ nome: t.nome, serie: t.serie })));
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turmas:', error);
        // Se for erro 404 ou similar, tratar como estado vazio
        if (error.status === 404 || error.status === 403) {
          this.turmas = [];
          this.error = '';
        } else {
          this.error = 'Erro ao carregar turmas. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }

  editTurma(turmaId: string): void {
    this.router.navigate(['/admin/turmas/editar', turmaId]);
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
        (turma.serie && turma.serie.toLowerCase().includes(this.searchTerm.toLowerCase()))
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

  getTotalDisciplinas(turmaId: string): number {
    const turma = this.turmas.find(t => t.id === turmaId);
    if (turma?.disciplinas && turma.disciplinas.length > 0) {
      return turma.disciplinas.length;
    }
    if (turma?.disciplinasIds && turma.disciplinasIds.length > 0) {
      return turma.disciplinasIds.length;
    }
    if (turma?.disciplinasNomes && turma.disciplinasNomes.length > 0) {
      return turma.disciplinasNomes.length;
    }
    return 0;
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

  // Métodos para gerenciar disciplinas da turma
  showGerenciarDisciplinas(turma: Turma): void {
    this.selectedTurma = turma;
    this.showDisciplinasModal = true;
    this.loadingDisciplinas = true;
    
    // Carregar disciplinas disponíveis
    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        this.disciplinasDisponiveis = disciplinas;
        // Inicializar disciplinas selecionadas com as que já estão associadas
        this.disciplinasSelecionadas = turma.disciplinasIds || [];
        this.loadingDisciplinas = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplinas:', error);
        this.alertService.error('Erro ao carregar disciplinas');
        this.loadingDisciplinas = false;
      }
    });
  }

  closeDisciplinasModal(): void {
    this.showDisciplinasModal = false;
    this.selectedTurma = null;
    this.disciplinasDisponiveis = [];
    this.disciplinasSelecionadas = [];
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
    const disciplina = this.disciplinasDisponiveis.find(d => d.id === disciplinaId);
    return disciplina ? disciplina.nome : 'Disciplina não encontrada';
  }

  salvarDisciplinas(): void {
    if (!this.selectedTurma?.id) return;

    this.loadingDisciplinas = true;
    const turmaId = this.selectedTurma.id;
    
    // Obter disciplinas atualmente associadas
    const disciplinasAtuais = this.selectedTurma.disciplinasIds || [];
    
    // Disciplinas para adicionar
    const paraAdicionar = this.disciplinasSelecionadas.filter(id => !disciplinasAtuais.includes(id));
    
    // Disciplinas para remover
    const paraRemover = disciplinasAtuais.filter(id => !this.disciplinasSelecionadas.includes(id));

    // Executar operações
    const operacoes = [
      ...paraAdicionar.map(id => this.turmaService.adicionarDisciplina(turmaId, id)),
      ...paraRemover.map(id => this.turmaService.removerDisciplina(turmaId, id))
    ];

    if (operacoes.length === 0) {
      this.closeDisciplinasModal();
      return;
    }

    // Executar todas as operações
    Promise.all(operacoes.map(op => op.toPromise())).then(() => {
      this.alertService.success('Disciplinas atualizadas com sucesso!');
      this.closeDisciplinasModal();
      this.loadTurmas(); // Recarregar a lista
    }).catch((error) => {
      console.error('❌ Erro ao atualizar disciplinas:', error);
      this.alertService.error('Erro ao atualizar disciplinas');
      this.loadingDisciplinas = false;
    });
  }
}
