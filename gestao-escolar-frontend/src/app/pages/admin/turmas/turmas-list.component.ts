import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TurmaService } from '../../../services/turma.service';
import { Turma } from '../../../models/aluno.model';

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

  series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  anos = [2024, 2025, 2026, 2027, 2028];

  constructor(private turmaService: TurmaService) {}

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

  deleteTurma(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.')) {
      this.turmaService.deleteTurma(id).subscribe({
        next: () => {
          console.log('✅ Turma excluída com sucesso');
          this.loadTurmas(); // Recarregar lista
        },
        error: (error) => {
          console.error('❌ Erro ao excluir turma:', error);
          this.error = 'Erro ao excluir turma';
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

  getTotalAlunos(turmaId: number): number {
    // TODO: Implementar contagem de alunos quando o serviço estiver disponível
    return Math.floor(Math.random() * 30) + 10; // Mock temporário
  }

  getTotalDisciplinas(turmaId: number): number {
    // TODO: Implementar contagem de disciplinas quando o serviço estiver disponível
    return Math.floor(Math.random() * 8) + 4; // Mock temporário
  }

  limparFiltros(): void {
    this.searchTerm = '';
    this.selectedSerie = '';
    this.selectedAno = null;
  }
}
