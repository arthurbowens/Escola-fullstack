import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { AuthService } from '../../services/auth.service';
import { AlunoService } from '../../services/aluno.service';
import { NotaService, NotaDTO } from '../../services/nota.service';
import { FrequenciaService, FrequenciaDTO } from '../../services/frequencia.service';
import { Usuario, TipoUsuario } from '../../models/usuario.model';
import { Aluno, Nota, Frequencia, FrequenciaResumo } from '../../models/aluno.model';

@Component({
  selector: 'app-aluno-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ChangePasswordComponent],
  templateUrl: './aluno-dashboard.component.html',
  styleUrls: ['./aluno-dashboard.component.scss']
})
export class AlunoDashboardComponent implements OnInit {
  aluno: Aluno | null = null;
  notas: NotaDTO[] = [];
  frequencias: FrequenciaDTO[] = [];
  frequenciasResumo: FrequenciaResumo[] = [];
  loading = false;
  error = '';
  showChangePasswordModal = false;

  constructor(
    private authService: AuthService,
    private alunoService: AlunoService,
    private notaService: NotaService,
    private frequenciaService: FrequenciaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAlunoData();
  }

  loadAlunoData(): void {
    this.loading = true;
    this.error = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'Usuário não encontrado';
      this.loading = false;
      return;
    }

    const alunoId = currentUser.id;
    console.log('👤 Carregando dados do aluno:', alunoId);

    // Buscar dados do aluno usando o endpoint /me
    this.alunoService.getMeusDados().subscribe({
      next: (aluno) => {
        console.log('✅ Dados do aluno carregados:', aluno);
        this.aluno = aluno;
        
        // Buscar notas do aluno usando o ID real do aluno
        if (aluno.id) {
          this.loadNotas(aluno.id);
          this.loadFrequencias(aluno.id);
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dados do aluno:', err);
        this.error = 'Erro ao carregar dados do aluno';
        this.loading = false;
      }
    });
  }

  loadNotas(alunoId: string): void {
    console.log('📊 Iniciando busca de notas para aluno:', alunoId);
    this.notaService.getNotasPorAluno(alunoId).subscribe({
      next: (notas) => {
        console.log('✅ Notas carregadas:', notas);
        console.log('📊 Total de notas:', notas.length);
        this.notas = notas;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar notas:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        // Não mostrar erro para notas, apenas log
      }
    });
  }

  loadFrequencias(alunoId: string): void {
    console.log('📅 Iniciando busca de frequências para aluno:', alunoId);
    this.frequenciaService.getFrequenciasPorAluno(alunoId).subscribe({
      next: (frequencias) => {
        console.log('✅ Frequências carregadas:', frequencias);
        console.log('📅 Total de frequências:', frequencias.length);
        this.frequencias = frequencias;
        // Converter FrequenciaDTO[] para Frequencia[] para o processamento
        const frequenciasParaProcessar: Frequencia[] = frequencias.map(freq => ({
          id: freq.id,
          dataAula: freq.dataAula,
          presente: freq.presente,
          observacao: freq.observacao,
          disciplina: freq.disciplinaId ? { id: freq.disciplinaId, nome: freq.disciplinaNome || '' } : undefined,
          aluno: freq.alunoId ? { id: freq.alunoId, nome: '' } : undefined
        }));
        this.frequenciasResumo = this.frequenciaService.processarFrequencias(frequenciasParaProcessar);
        console.log('📅 Resumo de frequências:', this.frequenciasResumo);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar frequências:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        // Não mostrar erro para frequências, apenas log
        this.loading = false;
      }
    });
  }

  calcularMediaDisciplina(disciplina: string): number {
    if (!this.notas || this.notas.length === 0) return 0;
    
    const notasDisciplina = this.notas.filter(nota => nota.disciplinaNome === disciplina);
    if (notasDisciplina.length === 0) return 0;
    
    const soma = notasDisciplina.reduce((acc, nota) => acc + nota.valor, 0);
    return soma / notasDisciplina.length;
  }

  calcularMediaGeral(): number {
    if (!this.notas || this.notas.length === 0) return 0;
    
    const disciplinas = [...new Set(this.notas.map(nota => nota.disciplinaNome).filter(Boolean) as string[])];
    const mediasDisciplinas = disciplinas.map(disciplina => this.calcularMediaDisciplina(disciplina));
    
    if (mediasDisciplinas.length === 0) return 0;
    
    const soma = mediasDisciplinas.reduce((acc, media) => acc + media, 0);
    return soma / mediasDisciplinas.length;
  }

  getSituacaoFinal(): string {
    const mediaGeral = this.calcularMediaGeral();
    const frequenciaMinima = this.frequenciasResumo.some(f => f.percentual < 75);
    
    if (mediaGeral >= 7 && !frequenciaMinima) {
      return 'Aprovado';
    } else if (mediaGeral >= 5 && !frequenciaMinima) {
      return 'Recuperação';
    } else {
      return 'Reprovado';
    }
  }

  getCorSituacao(): string {
    const situacao = this.getSituacaoFinal();
    switch (situacao) {
      case 'Aprovado': return 'text-green-600 bg-green-100';
      case 'Recuperação': return 'text-yellow-600 bg-yellow-100';
      case 'Reprovado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getDisciplinas(): string[] {
    if (!this.notas || this.notas.length === 0) return [];
    return [...new Set(this.notas.map(nota => nota.disciplinaNome).filter(Boolean) as string[])];
  }

  getNotasDisciplina(disciplina: string): NotaDTO[] {
    if (!this.notas || this.notas.length === 0) return [];
    return this.notas.filter(nota => nota.disciplinaNome === disciplina);
  }

  calcularFrequenciaMedia(): number {
    if (!this.frequenciasResumo || this.frequenciasResumo.length === 0) return 0;
    
    const soma = this.frequenciasResumo.reduce((acc, f) => acc + f.percentual, 0);
    return soma / this.frequenciasResumo.length;
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
