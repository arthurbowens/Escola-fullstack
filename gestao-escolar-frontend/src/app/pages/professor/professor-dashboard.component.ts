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
import { NotaService } from '../../services/nota.service';
import { FrequenciaService } from '../../services/frequencia.service';
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
  notas: Nota[] = [];
  frequencias: Frequencia[] = [];
  
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfessorData();
  }

  loadProfessorData(): void {
    this.loading = true;
    this.error = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'Usuário não encontrado';
      this.loading = false;
      return;
    }

    console.log('👨‍🏫 Carregando dados do professor:', currentUser.id);

    // Por enquanto, vamos simular dados do professor
    // Em uma implementação real, você buscaria os dados do professor pelo email
    this.professor = {
      id: '1',
      nome: 'Prof. João Silva',
      email: currentUser.email,
      cpf: '123.456.789-00',
      formacaoAcademica: 'Licenciatura em Matemática',
      telefone: '(11) 99999-9999',
      disciplinas: [
        {
          id: '1',
          nome: 'Matemática',
          cargaHoraria: 80
        },
        {
          id: '2',
          nome: 'Física',
          cargaHoraria: 60
        }
      ]
    };

    this.disciplinas = this.professor.disciplinas || [];
    this.loading = false;
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
    // Por enquanto, vamos simular turmas
    // Em uma implementação real, você buscaria as turmas da disciplina
    this.turmas = [
      {
        id: '1',
        nome: '3º Ano A',
        serie: '3',
        anoLetivo: 2025,
        ano: '2025'
      },
      {
        id: '2',
        nome: '3º Ano B',
        serie: '3',
        anoLetivo: 2025,
        ano: '2025'
      }
    ];
  }

  loadAlunosTurma(): void {
    // Por enquanto, vamos simular alunos
    // Em uma implementação real, você buscaria os alunos da turma
    this.alunos = [
      {
        id: '1',
        nome: 'Gabriela Silva',
        email: 'gabi@gmail.com',
        matricula: '2025001',
        dataNascimento: '2005-03-15',
        senha: '123456',
        turma: this.turmaSelecionada || undefined
      },
      {
        id: '2',
        nome: 'Pedro Almeida',
        email: 'pedro.almeida@escola.com',
        matricula: '2025002',
        dataNascimento: '2005-07-20',
        senha: '123456',
        turma: this.turmaSelecionada || undefined
      }
    ];
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
      this.error = 'Selecione um aluno e uma disciplina';
      return;
    }

    if (this.novaNota.valor < 0 || this.novaNota.valor > 10) {
      this.error = 'Nota deve estar entre 0 e 10';
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
      } : undefined
    };

    this.notaService.createNota(nota).subscribe({
      next: (notaSalva) => {
        console.log('✅ Nota lançada:', notaSalva);
        this.loadNotasAluno();
        this.resetFormNota();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao lançar nota:', err);
        this.error = 'Erro ao lançar nota';
        this.loading = false;
      }
    });
  }

  marcarFrequencia(): void {
    if (!this.alunoSelecionado || !this.disciplinaSelecionada) {
      this.error = 'Selecione um aluno e uma disciplina';
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
      } : undefined
    };

    this.frequenciaService.createFrequencia(frequencia).subscribe({
      next: (frequenciaSalva) => {
        console.log('✅ Frequência marcada:', frequenciaSalva);
        this.loadFrequenciasAluno();
        this.resetFormFrequencia();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao marcar frequência:', err);
        this.error = 'Erro ao marcar frequência';
        this.loading = false;
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
      // Opcional: mostrar mensagem de sucesso
      console.log('Senha alterada com sucesso!');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
