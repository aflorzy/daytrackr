import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { AuthActions } from "../actions/auth.actions";
import { RouterActions } from "../actions/router.actions";

@Injectable()
export class AuthEffects {
  private action$ = inject(Actions);
  private authService = inject(AuthService);

  checkForToken$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.checkForToken),
      switchMap(() => {
        const tokenValid = this.authService.isTokenValid();

        if (tokenValid) return of(AuthActions.setToken({ token: this.authService.token }));
        else return of(AuthActions.logout());
      })
    );
  });

  register$ = createEffect(() => {
    return this.action$.pipe(
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
    return this.action$.pipe(
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
    return this.action$.pipe(
      ofType(AuthActions.logout, AuthActions.registerSuccess),
      switchMap(() => of(RouterActions.navigate({ route: "login" })))
    );
  });

  navigateHome$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() => of(RouterActions.navigate({ route: "" })))
    );
  });

  logout$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
        })
      );
    },
    { dispatch: false }
  );
}
