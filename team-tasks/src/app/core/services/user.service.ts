import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly environment: EnvironmentService
  ) {
    this.apiUrl = this.environment.getApiBaseUrl();
  }

  /**
   * קבלת כל המשתמשים במערכת
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * חיפוש משתמש לפי email
   */
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/email/${email}`);
  }
}