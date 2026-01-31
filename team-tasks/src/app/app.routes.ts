import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth routes
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register')
      .then(m => m.RegisterComponent)
  },
  
  // Protected routes
  {
    path: 'teams',
    loadComponent: () => import('./teams/teams')
      .then(m => m.TeamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'teams/:teamId/projects',
    loadComponent: () => import('./projects/projects')
      .then(m => m.ProjectsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'teams/:teamId/projects/:projectId/tasks',
    loadComponent: () => import('./tasks/tasks')
      .then(m => m.TasksComponent),
    canActivate: [authGuard]
  },
  
  // Redirects
  { 
    path: '', 
    redirectTo: '/teams', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/auth/login' 
  }
];