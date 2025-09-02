import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent {
  menuItems = [
    { label: 'Dashboard', route: '/admin', icon: 'home' },
    { label: 'Alunos', route: '/admin/alunos', icon: 'users' },
    { label: 'Professores', route: '/admin/professores', icon: 'academic-cap' },
    { label: 'Turmas', route: '/admin/turmas', icon: 'office-building' },
    { label: 'Disciplinas', route: '/admin/disciplinas', icon: 'book-open' },
    { label: 'Relatórios', route: '/admin/relatorios', icon: 'chart-bar' }
  ];
}
