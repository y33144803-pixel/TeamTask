import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  /**
   * קביעת URL של ה-API
   * בלוקל: http://localhost:3000/api
   * בענן: /api (relative path - אותו דומיין)
   */
  getApiBaseUrl(): string {
    // בלוקל
    if (window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1')) {
      return 'http://localhost:3000/api';
    }

    // בענן - אותו דומיין (Backend מגיש גם Frontend)
    return '/api';
  }
}