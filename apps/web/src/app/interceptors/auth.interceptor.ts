import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { AccessToken } from "../interfaces";
import { AuthService } from "../services/auth.service";
import { AuthActions } from "../store/actions/auth.actions";
import { selectToken } from "../store/selectors/auth.selector";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private store = inject(Store);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectToken).pipe(
      switchMap(token => {
        if (token) {
          request = this.addToken(request, token);
        }

        // request = request.clone({
        //   setHeaders: { Accept: "application/json; charset=utf-8", "Content-Type": "application/json" }
        // });

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && token) {
              return this.handleTokenExpired(request, next);
            }
            return throwError(error);
          })
        );
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: AccessToken | null): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `${token?.tokenType}${token?.accessToken}` } });
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Call the refresh token endpoint to get a new access token
    return this.authService.refreshAccessToken().pipe(
      tap(newToken => {
        this.store.dispatch(AuthActions.refreshTokenSuccess({ token: newToken }));
      }),
      switchMap(newToken => {
        // Retry the original request with the new access token
        return next.handle(this.addToken(request, newToken));
      }),
      catchError((error: HttpErrorResponse) => {
        this.store.dispatch(AuthActions.logout());

        return throwError(error);
      })
    );
  }
}
