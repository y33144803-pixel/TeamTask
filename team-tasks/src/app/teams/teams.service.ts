// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError, TimeoutError } from 'rxjs';
// import { catchError, timeout } from 'rxjs/operators';

// export interface Team {
//   id: string;
//   name: string;
//   members_count: number;
// }

// export interface TeamMember {
//   id: string;
//   name: string;
//   email: string;
// }

// @Injectable({ providedIn: 'root' })
// export class TeamsService {
//   private readonly apiUrl = 'http://localhost:3000/api/teams';
//   private readonly defaultTimeout = 15000;

//   constructor(private http: HttpClient) {}

//   getTeams(): Observable<Team[]> {
//     return this.http.get<Team[]>(this.apiUrl).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   createTeam(data: { name: string }): Observable<Team> {

//     return this.http.post<Team>(this.apiUrl, data).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }
//   //   createTeam(data: { name: string }): Observable<Team> {
//   //     console.log('Creating team with data:', data);
//   //     //  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   //   return this.http.post<Team>(this.apiUrl, data, {
//   //     // נדרש רק אם השרת דורש Header נוסף, לרוב לא חובה:
//   //   });
//   // }
 
//   addMember(teamId: string, userId: number): Observable<TeamMember> {
//     if (!teamId || !userId || userId <= 0) {
//       return throwError(() => ({
//         status: 400,
//         error: { message: 'נתונים לא תקינים' }
//       }));
//     }

//     return this.http.post<TeamMember>(
//       `${this.apiUrl}/${teamId}/members`,
//       { userId }
//     ).pipe(
//       timeout(this.defaultTimeout),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse | TimeoutError): Observable<never> {
//     if (error instanceof TimeoutError) {
//       return throwError(() => ({
//         status: 504,
//         error: { message: 'הבקשה ארכה יותר מדי זמן' }
//       }));
//     }
    
//     return throwError(() => error);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// ⚠️ הסר את ההגדרות המקומיות - ייבא מהמודלים
import { 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest,
  TeamMember, 
  AddTeamMemberRequest 
} from '../shared/models/team.model';
import { EnvironmentService } from '../core/services/environment.service';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly apiUrl: string;
  private readonly defaultTimeout = 15000;

  constructor(
    private readonly http: HttpClient,
    private readonly environment: EnvironmentService
  ) {
    this.apiUrl = `${this.environment.getApiBaseUrl()}/teams`;
  }

  /**
   * קבלת כל הצוותים של המשתמש
   */
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * קבלת צוות לפי ID
   */
  getTeamById(teamId: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * יצירת צוות חדש
   */
  createTeam(data: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, data).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * עדכון צוות קיים
   */
  updateTeam(teamId: number, data: UpdateTeamRequest): Observable<Team> {
    return this.http.patch<Team>(`${this.apiUrl}/${teamId}`, data).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * מחיקת צוות
   */
  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * הוספת חבר לצוות
   */
  addMember(teamId: number, data: AddTeamMemberRequest): Observable<void> {
    if (!teamId || !data.userId || data.userId <= 0) {
      return throwError(() => new Error('נתונים לא תקינים'));
    }

    return this.http.post<void>(
      `${this.apiUrl}/${teamId}/members`,
      data
    ).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * קבלת רשימת חברי צוות
   */
  getTeamMembers(teamId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/${teamId}/members`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * הסרת חבר מצוות
   */
  removeMember(teamId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/members/${userId}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * טיפול בשגיאות HTTP
   */
  private handleError(error: HttpErrorResponse | TimeoutError): Observable<never> {
    let errorMessage = 'אירעה שגיאה לא צפויה';

    if (error instanceof TimeoutError) {
      errorMessage = 'הבקשה ארכה יותר מדי זמן';
    } else if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // שגיאת client
        errorMessage = `שגיאה: ${error.error.message}`;
      } else {
        // שגיאת server
        errorMessage = error.error?.message || `שגיאת שרת: ${error.status}`;
      }
    }

    console.error('Teams Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}