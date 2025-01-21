import { inject, Injectable } from "@angular/core";
import { CanActivate, CanActivateChild } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable } from "rxjs";
import { RouterActions } from "../store/actions/router.actions";
import { selectIsAuthenticatedUser } from "../store/selectors/auth.selector";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private store = inject(Store);

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
