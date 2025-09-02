import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DisciplinaService } from '../../../services/disciplina.service';
import { AlertService } from '../../../services/alert.service';
import { Disciplina } from '../../../models/disciplina.model';

@Component({
  selector: 'app-disciplinas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './disciplinas-list.component.html',
  styleUrls: ['./disciplinas-list.component.scss']
})
export class DisciplinasListComponent implements OnInit {
  disciplinas: Disciplina[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  constructor(
    private disciplinaService: DisciplinaService,
    private alertService: AlertService,
    public router: Router
  ) {}

  ngOnInit(): void {
    console.log('📚 Componente DisciplinasListComponent inicializado');
    this.loadDisciplinas();
  }

  loadDisciplinas(): void {
    this.loading = true;
    this.error = '';

    this.disciplinaService.getDisciplinas().subscribe({
      next: (disciplinas) => {
        this.disciplinas = disciplinas || [];
        console.log('✅ Disciplinas carregadas:', disciplinas);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplinas:', error);
        if (error.status === 404 || error.status === 403) {
          this.disciplinas = [];
          this.error = '';
        } else {
          this.error = 'Erro ao carregar disciplinas. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }

  editDisciplina(disciplinaId: string): void {
    this.router.navigate(['/admin/disciplinas/editar', disciplinaId]);
  }

  async deleteDisciplina(disciplinaId: string): Promise<void> {
    const disciplina = this.disciplinas.find(d => d.id === disciplinaId);
    const nomeDisciplina = disciplina?.nome || 'esta disciplina';

    const confirmed = await this.alertService.confirmDelete(
      'Excluir Disciplina',
      `Tem certeza que deseja excluir a disciplina "${nomeDisciplina}"? Esta ação não pode ser desfeita.`,
      'Sim, excluir disciplina!'
    );

    if (confirmed) {
      this.alertService.loading('Excluindo disciplina...', 'Aguarde um momento');

      this.disciplinaService.deleteDisciplina(disciplinaId).subscribe({
        next: () => {
          this.alertService.closeLoading();
          this.alertService.success('Disciplina excluída!', 'A disciplina foi removida com sucesso.');
          this.loadDisciplinas();
        },
        error: (error) => {
          this.alertService.closeLoading();
          console.error('❌ Erro ao excluir disciplina:', error);
          this.alertService.error('Erro ao excluir disciplina', 'Tente novamente mais tarde.');
        }
      });
    }
  }

  get filteredDisciplinas(): Disciplina[] {
    if (!this.searchTerm.trim()) {
      return this.disciplinas;
    }

    const term = this.searchTerm.toLowerCase();
    return this.disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(term) ||
      disciplina.cargaHoraria.toString().includes(term)
    );
  }

  limparFiltros(): void {
    this.searchTerm = '';
  }

  getProfessorNome(disciplina: Disciplina): string {
    if (disciplina.professorNome) {
      return disciplina.professorNome;
    }
    if (disciplina.professorId) {
      return `Professor ${disciplina.professorId.substring(0, 8)}...`;
    }
    return 'Não atribuído';
  }
}
