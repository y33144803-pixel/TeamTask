import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { EnvironmentService } from '../core/services/environment.service';

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  parentId?: string;
}

export interface CreateCommentDto {
  taskId: string;
  content: string;
  parentId?: string;
}

// ממשק מהשרת (snake_case)
interface CommentFromServer {
  id: string;
  taskId?: string;
  task_id?: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
  parent_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly apiUrl: string;
  private http = inject(HttpClient);
  private environment = inject(EnvironmentService);

  constructor() {
    this.apiUrl = `${this.environment.getApiBaseUrl()}/comments`;
  }

  // Cache with Signals
  private commentsCache = signal<Map<string, Comment[]>>(new Map());

  /**
   * Get all comments for a specific task
   */
  getCommentsByTaskId(taskId: string): Observable<Comment[]> {
    return this.http.get<CommentFromServer[]>(`${this.apiUrl}?taskId=${taskId}`).pipe(
      map(serverComments => serverComments.map(c => this.mapFromServer(c, taskId))),
      tap(comments => this.updateCache(taskId, comments)),
      catchError(this.handleError)
    );
  }

  /**
   * Add new comment
   */
  addComment(dto: CreateCommentDto): Observable<Comment> {
    const body = {
      taskId: dto.taskId,
      body: dto.content,
      parentId: dto.parentId || undefined
    };

    console.log('📤 Creating comment:', body);

    return this.http.post<CommentFromServer>(this.apiUrl, body).pipe(
      map(serverComment => this.mapFromServer(serverComment, dto.taskId)),
      tap(newComment => {
        console.log('✅ Comment created:', newComment);
        this.addToCache(dto.taskId, newComment);
      }),
      catchError((error) => {
        console.error('❌ Create Error:', error.error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get replies for a specific comment
   */
  getReplies(parentId: string): Observable<Comment[]> {
    return this.http.get<CommentFromServer[]>(`${this.apiUrl}?parentId=${parentId}`).pipe(
      map(serverComments => serverComments.map(c => this.mapFromServer(c))),
      catchError(this.handleError)
    );
  }

  /**
   * Get comment count for a task
   */
  getCommentCount(taskId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count?taskId=${taskId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Map server response to client model
   */
  private mapFromServer(serverComment: CommentFromServer, fallbackTaskId?: string): Comment {
    return {
      id: String(serverComment.id),
      taskId: String(serverComment.taskId || serverComment.task_id || fallbackTaskId || ''),
      authorId: String(serverComment.user_id),
      authorName: serverComment.author_name || 'משתמש',
      content: serverComment.body || '',
      createdAt: new Date(serverComment.created_at),
      parentId: serverComment.parent_id ? String(serverComment.parent_id) : undefined
    };
  }

  /**
   * Get cached comments for a task
   */
  getCachedComments(taskId: string): Comment[] | undefined {
    return this.commentsCache().get(taskId);
  }

  /**
   * Clear cache for a task
   */
  clearCache(taskId: string): void {
    const cache = new Map(this.commentsCache());
    cache.delete(taskId);
    this.commentsCache.set(cache);
  }

  /**
   * Update cache with new comments
   */
  private updateCache(taskId: string, comments: Comment[]): void {
    const cache = new Map(this.commentsCache());
    cache.set(taskId, comments);
    this.commentsCache.set(cache);
  }

  /**
   * Add new comment to cache
   */
  private addToCache(taskId: string, comment: Comment): void {
    const cache = new Map(this.commentsCache());
    const existing = cache.get(taskId) || [];
    cache.set(taskId, [...existing, comment]);
    this.commentsCache.set(cache);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'אירעה שגיאה לא צפויה';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `שגיאה: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'לא ניתן להתחבר לשרת';
          break;
        case 400:
          errorMessage = error.error?.message || 'בקשה שגויה';
          break;
        case 401:
          errorMessage = 'נדרשת הזדהות';
          break;
        case 403:
          errorMessage = 'אין הרשאה לביצוע פעולה זו';
          break;
        case 404:
          errorMessage = 'התגובה לא נמצאה';
          break;
        case 500:
          errorMessage = 'שגיאת שרת פנימית';
          break;
        default:
          errorMessage = `שגיאה: ${error.status} - ${error.message}`;
      }
    }

    console.error('CommentsService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}