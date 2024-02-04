import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of } from "rxjs";
import { Day } from "../../interfaces";
import { DayService } from "../../services/day.service";
import { DayActions, DayApiActions } from "../actions/day.actions";
import { selectSelectedDay } from "../selectors/day.selectors";

@Injectable()
export class DayEffects {
  loadToday$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DayActions.setInitialDay),
      concatLatestFrom(() => this.store.select(selectSelectedDay)),
      mergeMap(([_, selectedDay]) => {
        if (selectedDay.id) {
          return this.dayService
            .getDayById(selectedDay.id)
            .pipe(map((day: Day) => DayApiActions.retrieveTodaySuccess({ day })));
        } else {
          return this.dayService.getToday().pipe(map((day: Day) => DayApiActions.retrieveTodaySuccess({ day })));
        }
      })
    );
  });

  setDayByDate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DayActions.setDayByDate),
      mergeMap(action => {
        return this.dayService
          .getDayByDate(action.date)
          .pipe(map((day: Day) => DayApiActions.retrieveTodaySuccess({ day })));
      })
    );
  });

  loadDayList$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DayActions.getDayList),
      mergeMap(() =>
        this.dayService.getAllDays().pipe(
          map((dayList: Day[]) => DayApiActions.retrieveDayListSuccess({ dayList })),
          catchError((error: { message: string }) =>
            of(DayApiActions.retrieveDayListFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  loadDayListBetween$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DayActions.getDayListBetween),
      mergeMap(action =>
        this.dayService.getDaysBetween(action.date1, action.date2).pipe(
          map((dayList: Day[]) => DayApiActions.retrieveDayListSuccess({ dayList })),
          catchError((error: { message: string }) =>
            of(DayApiActions.retrieveDayListFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  saveEvent$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DayActions.saveEvent),
      mergeMap(action => {
        if (!action.event.name) {
          // Dispatch removeEvent action for events with empty names
          return of(DayActions.removeEvent({ event: action.event }));
        } else {
          // Dispatch updateEvent action for events with non-empty names
          return of(DayActions.updateEvent({ event: action.event }));
        }
      })
    );
  });

  saveSelectedDay$ = createEffect(() => {
    return this.action$.pipe(
      ofType(
        DayActions.saveDay,
        DayActions.addEvent,
        DayActions.removeEvent,
        DayActions.updateEvent,
        DayActions.moveEvent,
        DayActions.combineEvents
      ),
      concatLatestFrom(() => this.store.select(selectSelectedDay)),
      mergeMap(([_, selectedDay]: [any, Day]) => {
        // Delete day if last event removed
        if (!selectedDay.events.length) return of(DayActions.deleteDay({ day: selectedDay }));

        return this.dayService.saveDay(selectedDay).pipe(
          map((day: Day) => DayApiActions.saveDaySuccess({ day })),
          catchError((error: { message: string }) => of(DayApiActions.saveDayFailure({ errorMsg: error.message })))
        );
      })
    );
  });

  deleteDay$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DayActions.deleteDay),
      mergeMap(action =>
        this.dayService.deleteById(action.day.id || "").pipe(
          map(() => DayApiActions.deleteDaySuccess({ day: action.day })),
          catchError((error: { message: string }) => of(DayApiActions.deleteDayFailure({ errorMsg: error.message })))
        )
      )
    );
  });

  // Save multiple days

  constructor(
    private action$: Actions,
    private dayService: DayService,
    private store: Store
  ) { }
}
