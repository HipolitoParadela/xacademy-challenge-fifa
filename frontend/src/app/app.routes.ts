import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
  },

  {
    path: 'player/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/player-profile/player-profile.component')
        .then(m => m.PlayerProfileComponent),
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];