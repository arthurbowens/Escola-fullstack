import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlunoService } from '../../../services/aluno.service';
import { TurmaService } from '../../../services/turma.service';
import { ProfessorService } from '../../../services/professor.service';
import { DisciplinaService } from '../../../services/disciplina.service';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';
import { Aluno, Turma } from '../../../models/aluno.model';
import { Professor } from '../../../models/professor.model';
import { Disciplina } from '../../../models/disciplina.model';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit {
  loading = false;
  error = '';
  
  // Dados para relatórios
  totalAlunos = 0;
  totalProfessores = 0;
  totalTurmas = 0;
  totalDisciplinas = 0;
  
  alunos: Aluno[] = [];
  professores: Professor[] = [];
  turmas: Turma[] = [];
  disciplinas: Disciplina[] = [];
  
  // Filtros
  filtroTurma = '';
  filtroSerie = '';
  filtroDisciplina = '';
  
  // Relatórios específicos
  alunosPorTurma: { [key: string]: number } = {};
  disciplinasPorProfessor: { [key: string]: number } = {};
  turmasPorSerie: { [key: string]: number } = {};

  // Expor Object para o template
  Object = Object;

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private professorService: ProfessorService,
    private disciplinaService: DisciplinaService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    // Carregar todos os dados em paralelo
    Promise.all([
      this.alunoService.getAlunos().toPromise(),
      this.turmaService.getTurmas().toPromise(),
      this.professorService.getProfessores().toPromise(),
      this.disciplinaService.getDisciplinas().toPromise()
    ]).then(([alunos, turmas, professores, disciplinas]) => {
      this.alunos = alunos || [];
      this.turmas = turmas || [];
      this.professores = professores || [];
      this.disciplinas = disciplinas || [];
      
      this.calculateStatistics();
      this.loading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados:', error);
      this.error = 'Erro ao carregar dados para relatórios';
      this.loading = false;
    });
  }

  calculateStatistics(): void {
    // Totais gerais
    this.totalAlunos = this.alunos.length;
    this.totalProfessores = this.professores.length;
    this.totalTurmas = this.turmas.length;
    this.totalDisciplinas = this.disciplinas.length;

    // Alunos por turma
    this.alunosPorTurma = {};
    this.alunos.forEach(aluno => {
      const turmaNome = this.getTurmaNome(aluno.turmaId);
      this.alunosPorTurma[turmaNome] = (this.alunosPorTurma[turmaNome] || 0) + 1;
    });

    // Disciplinas por professor
    this.disciplinasPorProfessor = {};
    this.disciplinas.forEach(disciplina => {
      const professorNome = disciplina.professorNome || 'Sem Professor';
      this.disciplinasPorProfessor[professorNome] = (this.disciplinasPorProfessor[professorNome] || 0) + 1;
    });

    // Turmas por série
    this.turmasPorSerie = {};
    this.turmas.forEach(turma => {
      const serie = turma.serie || 'Sem Série';
      this.turmasPorSerie[serie] = (this.turmasPorSerie[serie] || 0) + 1;
    });
  }

  getTurmaNome(turmaId: string | undefined): string {
    if (!turmaId) return 'Sem Turma';
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma ? turma.nome : 'Turma Não Encontrada';
  }

  getAlunosFiltrados(): Aluno[] {
    let alunosFiltrados = this.alunos;

    if (this.filtroTurma) {
      alunosFiltrados = alunosFiltrados.filter(aluno => 
        this.getTurmaNome(aluno.turmaId).toLowerCase().includes(this.filtroTurma.toLowerCase())
      );
    }

    return alunosFiltrados;
  }

  getTurmasFiltradas(): Turma[] {
    let turmasFiltradas = this.turmas;

    if (this.filtroSerie) {
      turmasFiltradas = turmasFiltradas.filter(turma => 
        (turma.serie || '').toLowerCase().includes(this.filtroSerie.toLowerCase())
      );
    }

    return turmasFiltradas;
  }

  getDisciplinasFiltradas(): Disciplina[] {
    let disciplinasFiltradas = this.disciplinas;

    if (this.filtroDisciplina) {
      disciplinasFiltradas = disciplinasFiltradas.filter(disciplina => 
        disciplina.nome.toLowerCase().includes(this.filtroDisciplina.toLowerCase())
      );
    }

    return disciplinasFiltradas;
  }

  limparFiltros(): void {
    this.filtroTurma = '';
    this.filtroSerie = '';
    this.filtroDisciplina = '';
  }

  exportarRelatorio(tipo: string): void {
    // Implementar exportação de relatórios
    console.log(`Exportando relatório: ${tipo}`);
    // Aqui você pode implementar a lógica de exportação para PDF, Excel, etc.
  }
}
