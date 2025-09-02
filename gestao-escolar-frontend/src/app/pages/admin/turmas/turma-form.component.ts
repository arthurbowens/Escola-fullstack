import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TurmaService } from '../../../services/turma.service';
import { Turma } from '../../../models/aluno.model';

@Component({
  selector: 'app-turma-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './turma-form.component.html',
  styleUrls: ['./turma-form.component.scss']
})
export class TurmaFormComponent implements OnInit {
  turma: Turma = {
    nome: '',
    serie: '',
    anoLetivo: new Date().getFullYear()
  };

  loading = false;
  error = '';
  isEditMode = false;
  turmaId: string | null = null;

  series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  anos = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  constructor(
    private turmaService: TurmaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.turmaId = id;
      this.loadTurma(this.turmaId);
    }
  }

  private loadTurma(id: string): void {
    this.loading = true;
    this.turmaService.getTurmaById(id).subscribe({
      next: (turma) => {
        this.turma = {
          nome: turma.nome,
          serie: turma.serie,
          anoLetivo: turma.anoLetivo
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar turma:', error);
        this.error = 'Erro ao carregar dados da turma';
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

    if (this.isEditMode && this.turmaId) {
      this.updateTurma();
    } else {
      this.createTurma();
    }
  }

  private createTurma(): void {
    this.turmaService.createTurma(this.turma).subscribe({
      next: (turma) => {
        console.log('✅ Turma criada com sucesso:', turma);
        this.router.navigate(['/admin/turmas']);
      },
      error: (error) => {
        console.error('❌ Erro ao criar turma:', error);
        this.error = 'Erro ao criar turma';
        this.loading = false;
      }
    });
  }

  private updateTurma(): void {
    if (!this.turmaId) return;

    this.turmaService.updateTurma(this.turmaId, this.turma).subscribe({
      next: (turma) => {
        console.log('✅ Turma atualizada com sucesso:', turma);
        this.router.navigate(['/admin/turmas']);
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar turma:', error);
        this.error = 'Erro ao atualizar turma';
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.turma.nome.trim()) {
      this.error = 'Nome da turma é obrigatório';
      return false;
    }

    if (!this.turma.serie) {
      this.error = 'Série é obrigatória';
      return false;
    }

    if (!this.turma.anoLetivo) {
      this.error = 'Ano letivo é obrigatório';
      return false;
    }

    // Validar se o ano está no futuro ou é o ano atual
    const currentYear = new Date().getFullYear();
    if (this.turma.anoLetivo < currentYear) {
      this.error = 'Ano letivo deve ser o ano atual ou futuro';
      return false;
    }

    this.error = '';
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/turmas']);
  }

  generateTurmaName(): void {
    if (this.turma.serie && this.turma.anoLetivo) {
      this.turma.nome = `${this.turma.serie} ${this.turma.anoLetivo}`;
    }
  }
}
