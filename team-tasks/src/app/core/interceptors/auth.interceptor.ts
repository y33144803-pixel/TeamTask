import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // דלג על בקשות authentication (login/register)
  if (req.url.includes('/auth/login') || 
      req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  
  // הוסף token רק אם הוא קיים ולא ריק
  if (token && token.trim() !== '') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
