import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// ⚠️ הסר את ההגדרות המקומיות - ייבא מהמודלים
import { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '../shared/models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly apiUrl = 'http://localhost:3000/api/projects';
  private readonly defaultTimeout = 15000;

  constructor(private readonly http: HttpClient) {}

  /**
   * קבלת כל הפרויקטים של המשתמש
   * אופציונלי: סינון לפי teamId
   */
  getProjects(teamId?: number): Observable<Project[]> {
    const url = teamId 
      ? `${this.apiUrl}?teamId=${teamId}`
      : this.apiUrl;
      
    return this.http.get<Project[]>(url).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * קבלת פרויקט בודד לפי ID
   */
  getProjectById(id: number): Observable<Project> {
    if (!id || id <= 0) {
      return throwError(() => new Error('מזהה פרויקט לא תקין'));
    }

    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * יצירת פרויקט חדש
   */
  createProject(data: CreateProjectRequest): Observable<Project> {
    if (!data.name?.trim() || !data.teamId) {
      return throwError(() => new Error('נתונים לא תקינים - שם פרויקט וצוות נדרשים'));
    }

    return this.http.post<Project>(this.apiUrl, data).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * עדכון פרויקט קיים
   * ⚠️ שינוי: השתמש ב-PATCH במקום PUT (כמו ב-tasks)
   */
  updateProject(id: number, data: UpdateProjectRequest): Observable<Project> {
    if (!id || id <= 0) {
      return throwError(() => new Error('מזהה פרויקט לא תקין'));
    }

    return this.http.patch<Project>(`${this.apiUrl}/${id}`, data).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * מחיקת פרויקט
   */
  deleteProject(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('מזהה פרויקט לא תקין'));
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * שינוי סטטוס פרויקט
   * (אלטרנטיבה ל-archiveProject - יותר גמיש)
   */
  changeProjectStatus(id: number, status: 'active' | 'archived' | 'completed'): Observable<Project> {
    return this.updateProject(id, { status });
  }

  /**
   * טיפול בשגיאות HTTP/Timeout
   */
  private handleError = (error: HttpErrorResponse | TimeoutError): Observable<never> => {
    let errorMessage = 'אירעה שגיאה לא צפויה';

    if (error instanceof TimeoutError) {
      errorMessage = 'הבקשה ארכה יותר מדי זמן';
    } else if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // שגיאת client
        errorMessage = `שגיאה: ${error.error.message}`;
      } else {
        // שגיאת server
        switch (error.status) {
          case 0:
            errorMessage = 'אין חיבור לשרת';
            break;
          case 400:
            errorMessage = error.error?.message || 'נתונים לא תקינים';
            break;
          case 401:
            errorMessage = 'נדרשת הזדהות';
            break;
          case 403:
            errorMessage = 'אין הרשאה לבצע פעולה זו';
            break;
          case 404:
            errorMessage = 'הפרויקט לא נמצא';
            break;
          case 409:
            errorMessage = error.error?.message || 'קונפליקט בנתונים';
            break;
          default:
            errorMessage = error.error?.message || `שגיאת שרת: ${error.status}`;
        }
      }
    }

    console.error('Projects Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}