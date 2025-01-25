import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, takeUntil, tap, timer } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { AuthActions } from "../actions/auth.actions";
import { RouterActions } from "../actions/router.actions";

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  checkForToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.checkForToken),
      switchMap(() => {
        const tokenValid = this.authService.isTokenValid();

        if (tokenValid) return of(AuthActions.setToken({ token: this.authService.token }));
        else return of(AuthActions.logout());
      })
    );
  });

  monitorTokenExpiration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.setToken),
      switchMap(({ token }) => {
        const expirationTime = this.authService.getTokenExpiration(token);
        const timeUntilExpiry = expirationTime - Date.now();

        return timer(timeUntilExpiry).pipe(
          map(() => AuthActions.logout()),
          takeUntil(this.actions$.pipe(ofType(AuthActions.logout)))
        );
      })
    );
  });

  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.extendSession),
      switchMap(() =>
        this.authService.refreshToken().pipe(
          map(newToken => AuthActions.setToken({ token: newToken })),
          catchError(() => of(AuthActions.logout()))
        )
      )
    );
  });

  setToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(({ token }) => of(AuthActions.setToken({ token })))
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(payload =>
        this.authService.register(payload.username, payload.password).pipe(
          map(response =>
            response.error
              ? AuthActions.registerFailure({ errorMsg: response.error ?? "" })
              : AuthActions.registerSuccess()
          ),
          catchError((error: HttpErrorResponse) =>
            of(AuthActions.registerFailure({ errorMsg: error.error.error ?? "" }))
          )
        )
      )
    );
  });

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map(token => AuthActions.loginSuccess({ token })),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.loginFailure({
                errorMsg: error.error?.message ?? "Oops! Something went wrong. Please try again later."
              })
            )
          )
        )
      )
    );
  });

  navigateToLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout, AuthActions.registerSuccess),
      switchMap(() => of(RouterActions.navigate({ route: "login" })))
    );
  });

  navigateHome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() => of(RouterActions.navigate({ route: "" })))
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
        })
      );
    },
    { dispatch: false }
  );

  reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(AuthActions.reset()))
    );
  });
}
