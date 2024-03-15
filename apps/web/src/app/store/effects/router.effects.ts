import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs";
import { Router } from "@angular/router";
import { RouterActions } from "../actions/router.actions";

@Injectable()
export class RouterEffects {
  navigate$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(RouterActions.navigate),
        switchMap(({ route }) => this.router.navigate([route]))
      );
    },
    { dispatch: false }
  );

  constructor(
    private action$: Actions,
    private router: Router
  ) {}
}
