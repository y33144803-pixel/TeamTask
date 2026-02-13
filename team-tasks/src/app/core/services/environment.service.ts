import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  /**
   * קביעת URL של ה-API
   * בלוקל: http://localhost:3000/api
   * בענן: https://[backend-service-name].onrender.com/api
   */
  getApiBaseUrl(): string {
    return environment.apiBaseUrl;
  }
}
