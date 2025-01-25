import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { AuthActions } from "../store/actions/auth.actions";
import { selectToken } from "../store/selectors/auth.selector";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private store = inject(Store);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclude login and register routes
    const blacklistKeywords: string[] = ["/login", "/register"];
    const matchingKeywords = blacklistKeywords.filter((keyword: string) => req.url.endsWith(keyword));

    return this.store.select(selectToken).pipe(
      switchMap(token => {
        if (!matchingKeywords.length) {
          req = req.clone({ headers: req.headers.set("Authorization", `${token?.tokenType}${token?.accessToken}`) });
        }

        req = req.clone({
          headers: req.headers.set("Accept", "application/json; charset=utf-8").set("Content-Type", "application/json")
        });

        return next.handle(req).pipe(
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // Successful response, do nothing
            }
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Unauthorized (token expired or invalid), log the user out and navigate to the login page
              this.store.dispatch(AuthActions.logout());
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
