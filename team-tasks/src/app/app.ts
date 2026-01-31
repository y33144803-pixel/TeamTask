import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styles: [`
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(3px);
      animation: fadeIn 0.2s ease-in;
    }
    
    .global-loading-overlay mat-spinner {
      margin-bottom: 20px;
    }
    
    .global-loading-overlay p {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Auth Buttons */
    .auth-buttons {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .login-btn,
    .register-btn {
      color: white !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .login-btn:hover,
    .register-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    /* User Menu */
    .user-menu-header {
      padding: 12px 16px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .user-menu-name {
      font-weight: 500;
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }
    
    .user-menu-email {
      font-size: 14px;
      color: #666;
    }
    
    .user-button {
      color: white !important;
    }
    
    /* Nav Links */
    .nav-links a {
      color: white !important;
      margin: 0 4px;
    }
    
    .nav-links a.active-link {
      background: rgba(255, 255, 255, 0.2);
      border-bottom: 2px solid white;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .main-content {
      padding: 2rem;
      min-height: calc(100vh - 64px);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .global-loading-overlay p {
        font-size: 16px;
      }
      
      .auth-buttons {
        gap: 8px;
      }
    }
  `]
})
export class App {
  protected readonly title = signal('ניהול משימות צוות');
  protected readonly authService = inject(AuthService);
  protected readonly loadingService = inject(LoadingService);
  
  protected readonly currentUser = computed(() => this.authService.getCurrentUser());
  protected readonly isAuthenticated = computed(() => this.authService.isLoggedIn());

  onLogout(): void {
    this.authService.logout();
  }

  onSwitchUser(): void {
    this.authService.logout();
  }
}