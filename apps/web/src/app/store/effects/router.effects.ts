import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap } from "rxjs";
import { RouterActions } from "../actions/router.actions";

@Injectable()
export class RouterEffects {
  private action$ = inject(Actions);
  private router = inject(Router);

  navigate$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(RouterActions.navigate),
        exhaustMap(({ route }) => this.router.navigate([route]))
      );
    },
    { dispatch: false }
  );
}
