import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// ⚠️ הסר את ההגדרות המקומיות - ייבא מהמודלים
import { User } from '../../shared/models/user.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl: string;
  
  // Signal למשתמש מחובר
  private currentUserSignal = signal<User | null>(null);
  
  // Computed - האם משתמש מחובר
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  
  // גישה למשתמש (readonly)
  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly environment: EnvironmentService
  ) {
    this.apiUrl = `${this.environment.getApiBaseUrl()}/auth`;
    this.loadUserFromStorage();
  }

  /**
   * טעינת משתמש מ-localStorage בעת אתחול
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userJson && token) {
      try {
        const user: User = JSON.parse(userJson);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Failed to parse user from storage:', error);
        this.logout();
      }
    }
  }

  /**
   * רישום משתמש חדש
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.saveAuthData(response)),
        catchError(this.handleError)
      );
  }

  /**
   * התחברות משתמש
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.saveAuthData(response)),
        catchError(this.handleError)
      );
  }

  /**
   * שמירת נתוני אימות ב-localStorage
   */
  private saveAuthData(response: AuthResponse): void {
    if (!response || !response.token || !response.user) {
      throw new Error('תגובה לא תקינה מהשרת (חסר token/user)');
    }
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  /**
   * קבלת Token מה-localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * קבלת המשתמש המחובר הנוכחי
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  /**
   * בדיקה האם משתמש מחובר
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * התנתקות והסרת נתונים
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * טיפול בשגיאות HTTP
   */
  private handleError(error: unknown): Observable<never> {
    let errorMessage = 'אירעה שגיאה לא צפויה';

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `שגיאה: ${error.error.message}`;
      } else {
        errorMessage =
          (error.error as any)?.message ||
          (error.error as any)?.error ||
          `שגיאת שרת: ${error.status}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }

    console.error('Auth Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}