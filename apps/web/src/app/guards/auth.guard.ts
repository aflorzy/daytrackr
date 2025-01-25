import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, tap } from "rxjs";
import { selectIsAuthenticatedUser } from "../store/selectors/auth.selector";

// Authenticated user cannot access /login or /register
export const canActivateLoginRegisterGuard = (): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticatedUser).pipe(
    map(isAuthenticatedUser => !isAuthenticatedUser),
    tap(canNavigate => {
      if (!canNavigate) router.navigate([""]);
    })
  );
};

// Unuthenticated user cannot access home and child routes
export const canActivateHomeGuard = (): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticatedUser).pipe(
    tap(canNavigate => {
      if (!canNavigate) router.navigate(["/login"]);
    })
  );
};
