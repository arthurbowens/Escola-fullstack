import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { AuthService } from '../../services/auth.service';
import { ProfessorService } from '../../services/professor.service';
import { DisciplinaService } from '../../services/disciplina.service';
import { TurmaService } from '../../services/turma.service';
import { AlunoService } from '../../services/aluno.service';
import { NotaService, NotaDTO } from '../../services/nota.service';
import { FrequenciaService, FrequenciaDTO } from '../../services/frequencia.service';
import { AlertService } from '../../services/alert.service';
import { Usuario, TipoUsuario } from '../../models/usuario.model';
import { Professor } from '../../models/professor.model';
import { Disciplina } from '../../models/disciplina.model';
import { Turma } from '../../models/aluno.model';
import { Aluno } from '../../models/aluno.model';
import { Nota } from '../../models/aluno.model';
import { Frequencia } from '../../models/aluno.model';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChangePasswordComponent],
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.scss']
})
export class ProfessorDashboardComponent implements OnInit {
  professor: Professor | null = null;
  disciplinas: Disciplina[] = [];
  turmas: Turma[] = [];
  alunos: Aluno[] = [];
  
  // Seleções atuais
  disciplinaSelecionada: Disciplina | null = null;
  turmaSelecionada: Turma | null = null;
  alunoSelecionado: Aluno | null = null;
  
  // Dados para lançamento
  notas: NotaDTO[] = [];
  frequencias: FrequenciaDTO[] = [];
  
  // Estados
  loading = false;
  error = '';
  activeTab: 'notas' | 'frequencia' = 'notas';
  showChangePasswordModal = false;
  
  // Formulários
  novaNota = {
    valor: 0,
    tipoAvaliacao: 'PROVA',
    dataAvaliacao: new Date().toISOString().split('T')[0],
    observacao: ''
  };
  
  novaFrequencia = {
    dataAula: new Date().toISOString().split('T')[0],
    presente: true,
    observacao: ''
  };

  constructor(
    private authService: AuthService,
    private professorService: ProfessorService,
    private disciplinaService: DisciplinaService,
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private notaService: NotaService,
    private frequenciaService: FrequenciaService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfessorData();
  }

  loadProfessorData(): void {
    this.loading = true;
    this.error = '';

    console.log('👨‍🏫 Carregando dados do professor logado');

    this.professorService.getProfessorLogado().subscribe({
      next: (professor) => {
        console.log('✅ Professor carregado:', professor);
        this.professor = professor;
        
        // Carregar disciplinas do professor
        if (professor.disciplinas && professor.disciplinas.length > 0) {
          this.disciplinas = professor.disciplinas;
        } else if (professor.disciplinasIds && professor.disciplinasIds.length > 0) {
          // Se só temos IDs, carregar as disciplinas completas
          this.loadDisciplinasCompletas(professor.disciplinasIds);
        } else {
          this.disciplinas = [];
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar professor:', err);
        this.error = 'Erro ao carregar dados do professor';
        this.loading = false;
        this.alertService.error('Erro', 'Não foi possível carregar os dados do professor. Verifique sua conexão e tente novamente.');
      }
    });
  }

  private loadDisciplinasCompletas(disciplinasIds: string[]): void {
    // Carregar disciplinas completas pelos IDs
    const requests = disciplinasIds.map(id => 
      this.disciplinaService.getDisciplinaById(id)
    );

    Promise.all(requests.map(req => req.toPromise())).then((disciplinas) => {
      this.disciplinas = disciplinas.filter((d): d is Disciplina => d != null);
    }).catch((error) => {
      console.error('❌ Erro ao carregar disciplinas:', error);
      this.disciplinas = [];
    });
  }

  onDisciplinaChange(): void {
    if (this.disciplinaSelecionada) {
      console.log('📚 Disciplina selecionada:', this.disciplinaSelecionada);
      this.loadTurmasDisciplina();
      this.turmaSelecionada = null;
      this.alunoSelecionado = null;
      this.alunos = [];
    }
  }

  onTurmaChange(): void {
    if (this.turmaSelecionada) {
      console.log('🏫 Turma selecionada:', this.turmaSelecionada);
      this.loadAlunosTurma();
      this.alunoSelecionado = null;
    }
  }

  onAlunoChange(): void {
    if (this.alunoSelecionado && this.disciplinaSelecionada) {
      console.log('👨‍🎓 Aluno selecionado:', this.alunoSelecionado);
      this.loadNotasAluno();
      this.loadFrequenciasAluno();
    }
  }

  loadTurmasDisciplina(): void {
    if (!this.disciplinaSelecionada?.id) {
      this.turmas = [];
      return;
    }

    console.log('🏫 Carregando turmas da disciplina:', this.disciplinaSelecionada.id);

    this.turmaService.getTurmasPorDisciplina(this.disciplinaSelecionada.id).subscribe({
      next: (turmas) => {
        console.log('✅ Turmas carregadas:', turmas);
        this.turmas = turmas;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar turmas:', err);
        this.turmas = [];
        this.error = 'Erro ao carregar turmas da disciplina';
        this.alertService.error('Erro', 'Não foi possível carregar as turmas desta disciplina.');
      }
    });
  }

  loadAlunosTurma(): void {
    if (!this.turmaSelecionada?.id) {
      this.alunos = [];
      return;
    }

    console.log('👨‍🎓 Carregando alunos da turma:', this.turmaSelecionada.id);

    this.alunoService.getAlunosPorTurma(this.turmaSelecionada.id).subscribe({
      next: (alunos) => {
        console.log('✅ Alunos carregados:', alunos);
        this.alunos = alunos;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar alunos:', err);
        this.alunos = [];
        this.error = 'Erro ao carregar alunos da turma';
        this.alertService.error('Erro', 'Não foi possível carregar os alunos desta turma.');
      }
    });
  }

  loadNotasAluno(): void {
    if (!this.alunoSelecionado || !this.disciplinaSelecionada) return;

    this.notaService.getNotasPorAlunoEDisciplina(
      this.alunoSelecionado.id!,
      this.disciplinaSelecionada.id!
    ).subscribe({
      next: (notas) => {
        console.log('✅ Notas carregadas:', notas);
        this.notas = notas;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar notas:', err);
        this.notas = [];
      }
    });
  }

  loadFrequenciasAluno(): void {
    if (!this.alunoSelecionado || !this.disciplinaSelecionada) return;

    this.frequenciaService.getFrequenciasPorAlunoEDisciplina(
      this.alunoSelecionado.id!,
      this.disciplinaSelecionada.id!
    ).subscribe({
      next: (frequencias) => {
        console.log('✅ Frequências carregadas:', frequencias);
        this.frequencias = frequencias;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar frequências:', err);
        this.frequencias = [];
      }
    });
  }

  lancarNota(): void {
    if (!this.alunoSelecionado || !this.disciplinaSelecionada) {
      this.alertService.error('Erro', 'Selecione um aluno e uma disciplina antes de lançar a nota.');
      return;
    }

    if (this.novaNota.valor < 0 || this.novaNota.valor > 10) {
      this.alertService.error('Erro', 'A nota deve estar entre 0 e 10.');
      return;
    }

    if (!this.novaNota.dataAvaliacao) {
      this.alertService.error('Erro', 'A data da avaliação é obrigatória.');
      return;
    }

    this.loading = true;
    this.error = '';

    const nota: Nota = {
      valor: this.novaNota.valor,
      tipoAvaliacao: this.novaNota.tipoAvaliacao,
      dataAvaliacao: this.novaNota.dataAvaliacao,
      observacao: this.novaNota.observacao,
      disciplina: this.disciplinaSelecionada ? {
        id: this.disciplinaSelecionada.id!,
        nome: this.disciplinaSelecionada.nome
      } : undefined,
      aluno: this.alunoSelecionado ? {
        id: this.alunoSelecionado.id!,
        nome: this.alunoSelecionado.nome
      } : undefined
    };

    this.notaService.createNota(nota).subscribe({
      next: (notaSalva) => {
        console.log('✅ Nota lançada:', notaSalva);
        this.loadNotasAluno();
        this.resetFormNota();
        this.loading = false;
        this.alertService.success('Sucesso!', 'Nota lançada com sucesso.');
      },
      error: (err) => {
        console.error('❌ Erro ao lançar nota:', err);
        this.error = 'Erro ao lançar nota';
        this.loading = false;
        this.alertService.error('Erro', 'Não foi possível lançar a nota. Verifique os dados e tente novamente.');
      }
    });
  }

  marcarFrequencia(): void {
    if (!this.alunoSelecionado || !this.disciplinaSelecionada) {
      this.alertService.error('Erro', 'Selecione um aluno e uma disciplina antes de marcar a frequência.');
      return;
    }

    if (!this.novaFrequencia.dataAula) {
      this.alertService.error('Erro', 'A data da aula é obrigatória.');
      return;
    }

    this.loading = true;
    this.error = '';

    const frequencia: Frequencia = {
      dataAula: this.novaFrequencia.dataAula,
      presente: this.novaFrequencia.presente,
      observacao: this.novaFrequencia.observacao,
      disciplina: this.disciplinaSelecionada ? {
        id: this.disciplinaSelecionada.id!,
        nome: this.disciplinaSelecionada.nome
      } : undefined,
      aluno: this.alunoSelecionado ? {
        id: this.alunoSelecionado.id!,
        nome: this.alunoSelecionado.nome
      } : undefined
    };

    this.frequenciaService.createFrequencia(frequencia).subscribe({
      next: (frequenciaSalva) => {
        console.log('✅ Frequência marcada:', frequenciaSalva);
        this.loadFrequenciasAluno();
        this.resetFormFrequencia();
        this.loading = false;
        this.alertService.success('Sucesso!', 'Frequência marcada com sucesso.');
      },
      error: (err) => {
        console.error('❌ Erro ao marcar frequência:', err);
        this.error = 'Erro ao marcar frequência';
        this.loading = false;
        this.alertService.error('Erro', 'Não foi possível marcar a frequência. Verifique os dados e tente novamente.');
      }
    });
  }

  resetFormNota(): void {
    this.novaNota = {
      valor: 0,
      tipoAvaliacao: 'PROVA',
      dataAvaliacao: new Date().toISOString().split('T')[0],
      observacao: ''
    };
  }

  resetFormFrequencia(): void {
    this.novaFrequencia = {
      dataAula: new Date().toISOString().split('T')[0],
      presente: true,
      observacao: ''
    };
  }

  setActiveTab(tab: 'notas' | 'frequencia'): void {
    this.activeTab = tab;
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
  }

  onPasswordChanged(success: boolean): void {
    this.showChangePasswordModal = false;
    if (success) {
      this.alertService.success('Sucesso!', 'Senha alterada com sucesso.');
    }
  }

  clearError(): void {
    this.error = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
