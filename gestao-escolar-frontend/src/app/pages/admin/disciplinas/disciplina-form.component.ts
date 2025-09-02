import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DisciplinaService } from '../../../services/disciplina.service';
import { Disciplina, DisciplinaDTO } from '../../../models/disciplina.model';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-disciplina-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './disciplina-form.component.html',
  styleUrls: ['./disciplina-form.component.scss']
})
export class DisciplinaFormComponent implements OnInit {
  disciplina: DisciplinaDTO = {
    nome: '',
    cargaHoraria: 0
  };

  loading = false;
  error = '';
  isEditMode = false;
  disciplinaId: string | null = null;

  constructor(
    private disciplinaService: DisciplinaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.disciplinaId = id;
      this.loadDisciplina(id);
    } else {
      this.isEditMode = false;
    }
  }

  private loadDisciplina(id: string): void {
    this.loading = true;
    this.error = '';

    this.disciplinaService.getDisciplinaById(id).subscribe({
      next: (disciplina) => {
        this.disciplina = {
          nome: disciplina.nome,
          cargaHoraria: disciplina.cargaHoraria,
          professorId: disciplina.professorId
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar disciplina:', error);
        this.error = 'Erro ao carregar disciplina. Tente novamente.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.disciplinaId) {
      this.disciplinaService.updateDisciplina(this.disciplinaId, this.disciplina).subscribe({
        next: (disciplina) => {
          console.log('✅ Disciplina atualizada com sucesso:', disciplina);
          this.router.navigate(['/admin/disciplinas']);
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar disciplina:', error);
          this.error = 'Erro ao atualizar disciplina. Tente novamente.';
          this.loading = false;
        }
      });
    } else {
      this.disciplinaService.createDisciplina(this.disciplina).subscribe({
        next: (disciplina) => {
          console.log('✅ Disciplina criada com sucesso:', disciplina);
          this.router.navigate(['/admin/disciplinas']);
        },
        error: (error) => {
          console.error('❌ Erro ao criar disciplina:', error);
          this.error = 'Erro ao criar disciplina. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.disciplina.nome.trim()) {
      this.error = 'Nome da disciplina é obrigatório';
      return false;
    }

    if (!this.disciplina.cargaHoraria || this.disciplina.cargaHoraria <= 0) {
      this.error = 'Carga horária deve ser maior que zero';
      return false;
    }

    if (this.disciplina.cargaHoraria > 200) {
      this.error = 'Carga horária não pode ser maior que 200 horas';
      return false;
    }

    this.error = '';
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/disciplinas']);
  }
}
