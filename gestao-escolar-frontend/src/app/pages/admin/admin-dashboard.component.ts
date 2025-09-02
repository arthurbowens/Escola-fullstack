import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlunoService } from '../../services/aluno.service';
import { TurmaService } from '../../services/turma.service';
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

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.alunoService.getAlunos().subscribe({
      next: (alunos) => {
        this.alunos = alunos;
        this.totalAlunos = alunos.length;
      },
      error: (error) => {
        console.error('Erro ao carregar alunos:', error);
      }
    });

    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.totalTurmas = turmas.length;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
      }
    });
  }
}
