import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectIsAuthenticatedUser } from "../store/selectors/auth.selector";
import { Observable, map } from "rxjs";
import { RouterActions } from "../store/actions/router.actions";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticatedUser).pipe(
      map((isAuthenticatedUser: boolean) => {
        if (isAuthenticatedUser) {
          return true;
        } else {
          this.store.dispatch(RouterActions.navigate({ route: "/login" }));

          return false;
        }
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.store.select(selectIsAuthenticatedUser).pipe(
      map((isAuthenticatedUser: boolean) => {
        if (isAuthenticatedUser) {
          return true;
        } else {
          this.store.dispatch(RouterActions.navigate({ route: "/login" }));

          return false;
        }
      })
    );
  }
}
