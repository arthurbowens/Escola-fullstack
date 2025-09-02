import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  // Rotas futuras serão adicionadas aqui
  { path: '**', redirectTo: '/login' }
];
