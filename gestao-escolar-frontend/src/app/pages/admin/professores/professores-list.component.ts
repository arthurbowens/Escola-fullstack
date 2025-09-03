import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProfessorService } from '../../../services/professor.service';
import { AlertService } from '../../../services/alert.service';
import { Professor } from '../../../models/professor.model';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-professores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent],
  templateUrl: './professores-list.component.html',
  styleUrls: ['./professores-list.component.scss']
})
export class ProfessoresListComponent implements OnInit {
  professores: Professor[] = [];
  loading = false;
  error = '';

  searchTerm = '';
  selectedFormacao = '';

  formacoes = [
    'Graduação',
    'Especialização',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado'
  ];

  constructor(
    private professorService: ProfessorService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎓 Componente ProfessoresListComponent inicializado');
    this.loadProfessores();
  }

  loadProfessores(): void {
    this.loading = true;
    this.error = '';

    this.professorService.getProfessores().subscribe({
      next: (professores) => {
        this.professores = professores || [];
        this.loading = false;
        console.log('✅ Professores carregados:', professores);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar professores:', error);
        // Se for erro 404 ou similar, tratar como estado vazio
        if (error.status === 404 || error.status === 403) {
          this.professores = [];
          this.error = '';
        } else {
          this.error = 'Erro ao carregar professores. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }

  editProfessor(professorId: string): void {
    this.router.navigate(['/admin/professores/editar', professorId]);
  }

  async deleteProfessor(id: string): Promise<void> {
    const professor = this.professores.find(p => p.id === id);
    const nomeProfessor = professor ? professor.nome : 'este professor';
    
    const confirmed = await this.alertService.confirmDelete(
      'Excluir Professor',
      `Tem certeza que deseja excluir ${nomeProfessor}? Esta ação não pode ser desfeita e todas as disciplinas associadas serão afetadas.`,
      'Sim, excluir!'
    );

    if (confirmed) {
      this.alertService.loading('Excluindo...', 'Removendo professor do sistema');
      
      this.professorService.deleteProfessor(id).subscribe({
        next: () => {
          this.alertService.closeLoading();
          this.alertService.success(
            'Professor Excluído!',
            `${nomeProfessor} foi removido do sistema com sucesso.`
          );
          this.loadProfessores(); // Recarregar lista
        },
        error: (error) => {
          this.alertService.closeLoading();
          console.error('❌ Erro ao excluir professor:', error);
          this.alertService.error(
            'Erro ao Excluir',
            'Não foi possível excluir o professor. Tente novamente.'
          );
        }
      });
    }
  }

  get filteredProfessores(): Professor[] {
    let filtered = this.professores;

    // Filtrar por termo de busca
    if (this.searchTerm) {
      filtered = filtered.filter(professor =>
        professor.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        professor.cpf.includes(this.searchTerm) ||
        professor.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por formação
    if (this.selectedFormacao) {
      filtered = filtered.filter(professor => 
        professor.formacaoAcademica === this.selectedFormacao
      );
    }

    return filtered;
  }

  limparFiltros(): void {
    this.searchTerm = '';
    this.selectedFormacao = '';
  }

  getTotalDisciplinas(professorId: string): number {
    const professor = this.professores.find(p => p.id === professorId);
    if (professor?.disciplinas && professor.disciplinas.length > 0) {
      return professor.disciplinas.length;
    }
    if (professor?.disciplinasIds && professor.disciplinasIds.length > 0) {
      return professor.disciplinasIds.length;
    }
    if (professor?.disciplinasNomes && professor.disciplinasNomes.length > 0) {
      return professor.disciplinasNomes.length;
    }
    return 0;
  }
}
