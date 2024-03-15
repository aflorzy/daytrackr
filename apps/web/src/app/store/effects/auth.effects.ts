import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, take } from "rxjs";
import { AccessToken } from "../../interfaces";
import { AuthActions, AuthApiActions } from "../actions/auth.actions";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { StorageService } from "src/app/services/storage.service";
import { RouterActions } from "../actions/router.actions";
import { StatusType } from "src/app/enums";

@Injectable()
export class AuthEffects {
  checkForToken$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.checkForToken),
      switchMap(() => {
        const token: AccessToken = this.storageService.getItemFromStorage("token");

        if (token) return of(AuthApiActions.loginSuccess({ token }));
        else return of();
      })
    );
  });

  register$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.register),
      switchMap(payload =>
        this.authService.register(payload.username, payload.password).pipe(
          map((response: { message: string; error: string }) =>
            response.error
              ? AuthApiActions.registerFailure({ errorMsg: response.error })
              : AuthApiActions.registerSuccess({ message: response.message })
          ),
          catchError((error: { message: string }) => of(AuthApiActions.registerFailure({ errorMsg: error.message })))
        )
      )
    );
  });

  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          take(1),
          map((token: AccessToken) => AuthApiActions.loginSuccess({ token })),
          catchError((error: { message: string }) => of(AuthApiActions.loginFailure({ errorMsg: error.message })))
        )
      )
    );
  });

  loginSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthApiActions.loginSuccess),
      switchMap(({ token }) =>
        of(
          AuthActions.setToken({
            token
          }),
          RouterActions.navigate({ route: "" })
        )
      )
    );
  });

  logout$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        of(
          AuthActions.setToken({
            token: {
              accessToken: "",
              tokenType: ""
            }
          }),
          RouterActions.navigate({ route: "login" })
        )
      )
    );
  });

  // Always update isAuthenticatedUser when token is set
  setIsAuthenticatedUser$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.setToken),
      map(({ token }) => {
        this.storageService.setItemInStorage("token", token);

        return AuthActions.setIsAuthenticatedUser({
          isAuthenticatedUser: this.authService.isAuthenticatedUser(token)
        });
      })
    );
  });

  navigateToLogin$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthApiActions.registerSuccess),
        switchMap(() =>
          of(
            RouterActions.navigate({ route: "login" }),
            AuthActions.setResponseMessage({
              responseMsg: {
                message: "Successfully registered. Please login using your new credentials.",
                statusType: StatusType.SUCCESS
              }
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  navigateHome$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthApiActions.loginSuccess),
      switchMap(() => of(RouterActions.navigate({ route: "" })))
    );
  });

  // Hide response message after timer
  // hideResponseMsg$ = createEffect(() => {
  //   return this.action$.pipe(
  //     ofType(ProfileApiActions.saveProfileSuccess),
  //     concatLatestFrom(() => this.store.select(selectResponseMsg)),
  //     mergeMap(([_, responseMsg]: [any, ResponseMessage]) => {
  //       if (responseMsg.message)
  //         return of(
  //           ProfileActions.setResponseMessage({ responseMsg: { message: "", statusType: StatusType.NULL } })
  //         ).pipe(delay(5000));

  //       return of();
  //     })
  //   );
  // });

  constructor(
    private action$: Actions,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}
}
