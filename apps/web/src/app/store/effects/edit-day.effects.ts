import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from "@ngrx/store";
import { catchError, filter, map, of, switchMap } from "rxjs";
import { Day } from "../../interfaces";
import { DayService } from "../../services/day.service";
import { AuthActions } from "../actions/auth.actions";
import { EditDayActions, EditDayApiActions } from "../actions/edit-day.actions";
import { RouterActions } from "../actions/router.actions";
import { selectEditingDay } from "../selectors/edit-day.selector";
import { selectRouteParam } from "../selectors/router.selectors";

@Injectable()
export class EditDayEffects {
  private actions$ = inject(Actions);
  private dayService = inject(DayService);
  private store = inject(Store);

  loadDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EditDayActions.loadDay),
      concatLatestFrom(() =>
        this.store.select(selectRouteParam("date")).pipe(
          filter(Boolean),
          filter(date => !Number.isNaN(Date.parse(date)))
        )
      ),
      switchMap(([, date]) =>
        this.dayService.getDayByDate(date).pipe(map((day: Day) => EditDayApiActions.loadDaySuccess({ day })))
      ),
      catchError((error: HttpErrorResponse) => of(EditDayApiActions.loadDayFailure({ errorMsg: error.message })))
    );
  });

  moveEventUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EditDayActions.moveEventUp),
      switchMap(action => of(EditDayActions.moveEvent({ event: action.event, newIdx: action.event.idx - 1 })))
    );
  });

  moveEventDown$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EditDayActions.moveEventDown),
      switchMap(action => of(EditDayActions.moveEvent({ event: action.event, newIdx: action.event.idx + 1 })))
    );
  });

  saveEdits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EditDayActions.saveEdits),
      concatLatestFrom(() => this.store.select(selectEditingDay)),
      switchMap(([_, editingDay]: [any, Day]) => {
        // Delete day if last event removed
        if (!editingDay.events.length) return of(EditDayActions.deleteDay({ day: editingDay }));

        return this.dayService.saveDay(editingDay).pipe(map((day: Day) => EditDayApiActions.saveEditsSuccess({ day })));
      }),
      catchError((error: HttpErrorResponse) => of(EditDayApiActions.saveEditsFailure({ errorMsg: error.message })))
    );
  });

  navigateHome$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EditDayActions.cancelEdits, EditDayApiActions.saveEditsSuccess),
      switchMap(() => of(RouterActions.navigate({ route: "" })))
    );
  });

  deleteDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EditDayActions.deleteDay),
      switchMap(action =>
        this.dayService
          .deleteById(action.day.id || "")
          .pipe(map(() => EditDayApiActions.deleteDaySuccess({ day: action.day })))
      ),
      catchError((error: HttpErrorResponse) => of(EditDayApiActions.deleteDayFailure({ errorMsg: error.message })))
    );
  });

  reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(EditDayActions.reset()))
    );
  });
}
