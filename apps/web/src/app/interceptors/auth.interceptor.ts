import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclude login and register routes
    const blacklistKeywords: string[] = ['/auth/login', '/auth/register'];
    const matchingKeywords = blacklistKeywords.filter((keyword: string) => req.url.endsWith(keyword));

    if (!matchingKeywords.length) {
      req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${this.authService.token?.accessToken}`) });
    }

    req = req.clone({ headers: req.headers.set('Accept', 'application/json; charset=utf-8').set('Content-Type', 'application/json') });

    console.log('Headers', { ...req.headers });

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Successful response, do nothing
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized (token expired or invalid), log the user out and navigate to the login page
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
