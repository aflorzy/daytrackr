import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { Store } from "@ngrx/store";
import { AccessToken } from "../interfaces";
import { selectToken } from "../store/selectors/auth.selector";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclude login and register routes
    const blacklistKeywords: string[] = ["/login", "/register"];
    const matchingKeywords = blacklistKeywords.filter((keyword: string) => req.url.endsWith(keyword));

    return this.store.select(selectToken).pipe(
      switchMap((token: AccessToken) => {
        if (!matchingKeywords.length) {
          req = req.clone({ headers: req.headers.set("Authorization", `${token.tokenType}${token.accessToken}`) });
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
              this.authService.logout();
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
