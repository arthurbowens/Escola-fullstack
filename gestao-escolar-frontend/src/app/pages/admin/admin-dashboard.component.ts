import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AlunoService } from '../../services/aluno.service';
import { TurmaService } from '../../services/turma.service';
import { AlertService } from '../../services/alert.service';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';
import { Aluno, Turma } from '../../models/aluno.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  alunos: Aluno[] = [];
  turmas: Turma[] = [];
  totalAlunos = 0;
  totalTurmas = 0;
  loading = false;

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Carregar turmas primeiro para poder fazer a busca
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.totalTurmas = turmas.length;
        
        // Depois carregar alunos
        this.alunoService.getAlunos().subscribe({
          next: (alunos) => {
            this.alunos = alunos;
            this.totalAlunos = alunos.length;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erro ao carregar alunos:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.loading = false;
      }
    });
  }

  getTurmaNome(turmaId: string | undefined): string {
    if (!turmaId) return 'N/A';
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma ? turma.nome : 'N/A';
  }

  editAluno(alunoId: string): void {
    this.router.navigate(['/admin/alunos/editar', alunoId]);
  }

  async deleteAluno(alunoId: string): Promise<void> {
    const aluno = this.alunos.find(a => a.id === alunoId);
    const nomeAluno = aluno ? aluno.nome : 'este aluno';
    
    const confirmed = await this.alertService.confirmDelete(
      'Excluir Aluno',
      `Tem certeza que deseja excluir ${nomeAluno}? Esta ação não pode ser desfeita.`,
      'Sim, excluir!'
    );

    if (confirmed) {
      this.alertService.loading('Excluindo...', 'Removendo aluno do sistema');
      
      this.alunoService.deleteAluno(alunoId).subscribe({
        next: () => {
          this.alertService.closeLoading();
          this.alertService.success(
            'Aluno Excluído!',
            `${nomeAluno} foi removido do sistema com sucesso.`
          );
          this.loadDashboardData(); // Recarregar dados do dashboard
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
}
