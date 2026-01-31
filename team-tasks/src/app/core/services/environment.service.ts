import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  /**
   * קביעת URL של ה-API
   * בלוקל: http://localhost:3000/api
   * בענן: https://[backend-service-name].onrender.com/api
   */
  getApiBaseUrl(): string {
    // בלוקל
    if (window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('127.0.0.1')) {
      return 'http://localhost:3000/api';
    }

    // בענן - שרת Backend בדומיין נפרד
    // זה יהיה משונה בהתאם לשם השרת בRender
    return 'https://team-tasks-api.onrender.com/api';
  }
}
