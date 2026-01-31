// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
// import { Observable, throwError, TimeoutError } from 'rxjs';
// import { catchError, timeout } from 'rxjs/operators';

// export interface Task {
//   id: number;
//   title: string;
//   description?: string;
//   status: 'todo' | 'in-progress' | 'done';
//   priority?: 'low' | 'medium' | 'high';
//   projectId: number;
//   assignedTo?: string;
//   dueDate?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface CreateTaskDto {
//   title: string;
//   description?: string;
//   projectId: number;
//   assignedTo?: string;
//   priority?: 'low' | 'medium' | 'high';
//   dueDate?: string;
// }

// export interface UpdateTaskDto {
//   title?: string;
//   description?: string;
//   status?: 'todo' | 'in-progress' | 'done';
//   priority?: 'low' | 'medium' | 'high';
//   assignedTo?: string;
//   dueDate?: string;
// }

// @Injectable({ providedIn: 'root' })
// export class TasksService {
//   private readonly apiUrl = 'http://localhost:3000/api/tasks';
//   private readonly defaultTimeout = 15000;

//   constructor(private http: HttpClient) {}

//   /**
//    * GET /api/tasks (מוגן)
//    * מחזיר משימות של המשתמש; תומך במסנן projectId
//    */
//   getTasks(projectId?: number): Observable<Task[]> {
//     let params = new HttpParams();
    
//     if (projectId) {
//       params = params.set('projectId', projectId.toString());
//     }

//     return this.http.get<Task[]>(this.apiUrl, { params }).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * GET /api/tasks/:id (מוגן)
//    * מחזיר משימה בודדת לפי ID
//    */
//   getTaskById(id: number): Observable<Task> {
//     if (!id || id <= 0) {
//       return throwError(() => ({
//         status: 400,
//         error: { message: 'מזהה משימה לא תקין' }
//       }));
//     }

//     return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * POST /api/tasks (מוגן)
//    * יצירת משימה בפרויקט של צוות שהמשתמש חבר בו
//    */
//   createTask(data: CreateTaskDto): Observable<Task> {
//     if (!data.title?.trim() || !data.projectId) {
//       return throwError(() => ({
//         status: 400,
//         error: { message: 'נתונים לא תקינים - כותרת ופרויקט נדרשים' }
//       }));
//     }

//     return this.http.post<Task>(this.apiUrl, data).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * PATCH /api/tasks/:id (מוגן)
//    * עדכון שדות במשימה
//    */
//   updateTask(id: number, data: UpdateTaskDto): Observable<Task> {
//     if (!id || id <= 0) {
//       return throwError(() => ({
//         status: 400,
//         error: { message: 'מזהה משימה לא תקין' }
//       }));
//     }

//     return this.http.patch<Task>(`${this.apiUrl}/${id}`, data).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * DELETE /api/tasks/:id (מוגן)
//    * מחיקת משימה
//    */
//   deleteTask(id: number): Observable<void> {
//     if (!id || id <= 0) {
//       return throwError(() => ({
//         status: 400,
//         error: { message: 'מזהה משימה לא תקין' }
//       }));
//     }

//     return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * שינוי סטטוס משימה במהירות
//    */
//   changeTaskStatus(id: number, status: 'todo' | 'in-progress' | 'done'): Observable<Task> {
//     return this.updateTask(id, { status });
//   }

//   /**
//    * שינוי עדיפות משימה
//    */
//   changeTaskPriority(id: number, priority: 'low' | 'medium' | 'high'): Observable<Task> {
//     return this.updateTask(id, { priority });
//   }

//   /**
//    * טיפול בשגיאות HTTP/Timeout
//    */
//   private handleError(error: HttpErrorResponse | TimeoutError): Observable<never> {
//     if (error instanceof TimeoutError) {
//       return throwError(() => ({
//         status: 504,
//         error: { message: 'הבקשה ארכה יותר מדי זמן' }
//       }));
//     }

//     let errorMessage = 'אירעה שגיאה לא צפויה';
    
//     if (error.status === 0) {
//       errorMessage = 'אין חיבור לשרת';
//     } else if (error.status === 401) {
//       errorMessage = 'נדרשת הזדהות';
//     } else if (error.status === 403) {
//       errorMessage = 'אין הרשאה לבצע פעולה זו';
//     } else if (error.status === 404) {
//       errorMessage = 'המשימה לא נמצאה';
//     } else if (error.error?.message) {
//       errorMessage = error.error.message;
//     }

//     return throwError(() => ({
//       status: error.status,
//       error: { message: errorMessage }
//     }));
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// ⚠️ הסר את ההגדרות המקומיות - ייבא מהמודלים
import { 
  Task, 
  TaskStatus,
  TaskPriority,
  CreateTaskRequest, 
  UpdateTaskRequest 
} from '../shared/models/task.model';
import { EnvironmentService } from '../core/services/environment.service';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly apiUrl: string;
  private readonly defaultTimeout = 15000;

  constructor(
    private readonly http: HttpClient,
    private readonly environment: EnvironmentService
  ) {
    this.apiUrl = `${this.environment.getApiBaseUrl()}/tasks`;
  }

  /**
   * קבלת כל המשימות של המשתמש
   * אופציונלי: סינון לפי projectId
   */
  getTasks(projectId?: number): Observable<Task[]> {
    let params = new HttpParams();
    
    if (projectId) {
      params = params.set('projectId', projectId.toString());
    }

    return this.http.get<Task[]>(this.apiUrl, { params }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * קבלת משימה בודדת לפי ID
   */
  getTaskById(id: number): Observable<Task> {
    if (!id || id <= 0) {
      return throwError(() => new Error('מזהה משימה לא תקין'));
    }

    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * יצירת משימה חדשה
   */
  createTask(data: CreateTaskRequest): Observable<Task> {
    if (!data.title?.trim() || !data.projectId) {
      return throwError(() => new Error('נתונים לא תקינים - כותרת ופרויקט נדרשים'));
    }

    return this.http.post<Task>(this.apiUrl, data).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * עדכון משימה קיימת
   */
  updateTask(id: number, data: UpdateTaskRequest): Observable<Task> {
    if (!id || id <= 0) {
      return throwError(() => new Error('מזהה משימה לא תקין'));
    }

    return this.http.patch<Task>(`${this.apiUrl}/${id}`, data).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * מחיקת משימה
   */
  deleteTask(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('מזהה משימה לא תקין'));
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * שינוי סטטוס משימה במהירות
   */
  changeTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.updateTask(id, { status });
  }

  /**
   * שינוי עדיפות משימה
   */
  changeTaskPriority(id: number, priority: TaskPriority): Observable<Task> {
    return this.updateTask(id, { priority });
  }

  /**
   * הקצאת משימה למשתמש
   */
  assignTask(id: number, assigneeId: number): Observable<Task> {
    return this.updateTask(id, { assigneeId });
  }

  /**
   * עדכון תאריך יעד
   */
  updateDueDate(id: number, dueDate: string): Observable<Task> {
    return this.updateTask(id, { dueDate });
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
            errorMessage = 'המשימה לא נמצאה';
            break;
          case 409:
            errorMessage = error.error?.message || 'קונפליקט בנתונים';
            break;
          default:
            errorMessage = error.error?.message || `שגיאת שרת: ${error.status}`;
        }
      }
    }

    console.error('Tasks Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}