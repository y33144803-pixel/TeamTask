import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  /**
   * Get the API base URL
   * On production (Render), uses relative path /api
   * On development, uses localhost:3000/api
   */
  getApiBaseUrl(): string {
    // Check if we're on Render or a production environment
    if (this.isProduction()) {
      return '/api';
    }
    return 'http://localhost:3000/api';
  }

  /**
   * Determine if running in production
   */
  private isProduction(): boolean {
    // If the window location is not localhost, assume production
    return !window.location.hostname.includes('localhost') 
      && !window.location.hostname.includes('127.0.0.1');
  }
}
