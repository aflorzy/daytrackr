import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, filter, map, mergeMap, of, switchMap, tap } from "rxjs";
import { Day } from "../../interfaces";
import { DayService } from "../../services/day.service";
import { EditDayActions, EditDayApiActions } from "../actions/edit-day.actions";
import { selectEditingDay } from "../selectors/edit-day.selector";
import { selectRouteParam } from "../selectors/router.selectors";

@Injectable()
export class EditDayEffects {
  loadDay$ = createEffect(() => {
    return this.action$.pipe(
      ofType(EditDayActions.loadDay),
      switchMap(() =>
        this.store.select(selectRouteParam("date")).pipe(
          filter(param => !!param),
          mergeMap(date =>
            this.dayService.getDayByDate(date || "").pipe(
              map((day: Day) => EditDayApiActions.loadDaySuccess({ day })),
              catchError((error: { message: string }) =>
                of(EditDayApiActions.loadDayFailure({ errorMsg: error.message }))
              )
            )
          )
        )
      )
    );
  });

  moveEventUp$ = createEffect(() => {
    return this.action$.pipe(
      ofType(EditDayActions.moveEventUp),
      mergeMap(action => of(EditDayActions.moveEvent({ event: action.event, newIdx: action.event.idx - 1 })))
    );
  });

  moveEventDown$ = createEffect(() => {
    return this.action$.pipe(
      ofType(EditDayActions.moveEventDown),
      mergeMap(action => of(EditDayActions.moveEvent({ event: action.event, newIdx: action.event.idx + 1 })))
    );
  });

  saveEdits$ = createEffect(() => {
    return this.action$.pipe(
      ofType(EditDayActions.saveEdits),
      concatLatestFrom(() => this.store.select(selectEditingDay)),
      mergeMap(([_, editingDay]: [any, Day]) => {
        // Delete day if last event removed
        if (!editingDay.events.length) return of(EditDayActions.deleteDay({ day: editingDay }));

        return this.dayService.saveDay(editingDay).pipe(
          map((day: Day) => EditDayApiActions.saveEditsSuccess({ day })),
          catchError((error: { message: string }) =>
            of(EditDayApiActions.saveEditsFailure({ errorMsg: error.message }))
          )
        );
      })
    );
  });

  navigateHome$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(EditDayActions.cancelEdits, EditDayApiActions.saveEditsSuccess),
        tap(() => {
          this.router.navigate([""]);
        })
      );
    },
    { dispatch: false }
  );

  deleteDay$ = createEffect(() => {
    return this.action$.pipe(
      ofType(EditDayActions.deleteDay),
      mergeMap(action =>
        this.dayService.deleteById(action.day.id || "").pipe(
          map(() => EditDayApiActions.deleteDaySuccess({ day: action.day })),
          catchError((error: { message: string }) =>
            of(EditDayApiActions.deleteDayFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  constructor(
    private action$: Actions,
    private dayService: DayService,
    private store: Store,
    private router: Router
  ) {}
}
