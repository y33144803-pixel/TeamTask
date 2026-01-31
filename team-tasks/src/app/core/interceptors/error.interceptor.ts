import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Error Interceptor - טיפול בשגיאות HTTP גלובלי
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'אירעה שגיאה לא צפויה';

      if (error.error instanceof ErrorEvent) {
        // שגיאת Client-side
        errorMessage = `שגיאה: ${error.error.message}`;
      } else {
        // שגיאת Server-side
        switch (error.status) {
          case 0:
            errorMessage = 'לא ניתן להתחבר לשרת. בדוק את החיבור לאינטרנט.';
            break;
          case 400:
            errorMessage = error.error?.message || 'נתונים לא תקינים';
            break;
          case 401:
            errorMessage = 'נדרשת התחברות מחדש';
            // ניקוי token והפניה ל-login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'אין לך הרשאה לבצע פעולה זו';
            break;
          case 404:
            errorMessage = error.error?.message || 'המשאב לא נמצא';
            break;
          case 409:
            errorMessage = error.error?.message || 'קונפליקט בנתונים';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = 'שגיאת שרת. נסה שוב מאוחר יותר.';
            break;
          default:
            errorMessage = error.error?.message || `שגיאה: ${error.status}`;
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        error: error.error
      });

      // החזר error עם הודעה ברורה
      return throwError(() => new Error(errorMessage));
    })
  );
};