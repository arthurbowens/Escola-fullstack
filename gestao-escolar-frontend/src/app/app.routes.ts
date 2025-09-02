import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AlunosListComponent } from './pages/admin/alunos/alunos-list.component';
import { AlunoFormComponent } from './pages/admin/alunos/aluno-form.component';
import { TurmasListComponent } from './pages/admin/turmas/turmas-list.component';
import { TurmaFormComponent } from './pages/admin/turmas/turma-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/alunos', component: AlunosListComponent },
  { path: 'admin/alunos/novo', component: AlunoFormComponent },
  { path: 'admin/alunos/editar/:id', component: AlunoFormComponent },
  { path: 'admin/turmas', component: TurmasListComponent },
  { path: 'admin/turmas/novo', component: TurmaFormComponent },
  { path: 'admin/turmas/editar/:id', component: TurmaFormComponent },
  // Rotas futuras serão adicionadas aqui
  { path: '**', redirectTo: '/login' }
];
