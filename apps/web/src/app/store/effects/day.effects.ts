import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap } from "rxjs";
import { DayService } from "../../services/day.service";
import { AuthActions } from "../actions/auth.actions";
import { DayActions, DayApiActions } from "../actions/day.actions";
import { selectNextDayFromDayList, selectPreviousDayFromDayList, selectSelectedDay } from "../selectors/day.selectors";

@Injectable()
export class DayEffects {
  private actions$ = inject(Actions);
  private dayService = inject(DayService);
  private store = inject(Store);

  setOldestDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.setOldestDay, DayActions.initializeCalendarPage),
      switchMap(() =>
        this.dayService.getOldest().pipe(
          map(day => DayApiActions.retrieveOldestDaySuccess({ day })),
          catchError((error: HttpErrorResponse) =>
            of(DayApiActions.retrieveOldestDayFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  setLatestDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.setLatestDay, DayActions.initializeCalendarPage),
      switchMap(() =>
        this.dayService.getLatest().pipe(
          map(day => DayApiActions.retrieveLatestDaySuccess({ day })),
          catchError((error: HttpErrorResponse) =>
            of(DayApiActions.retrieveLatestDayFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  loadToday$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.setInitialDay, DayActions.initializeCalendarPage),
      concatLatestFrom(() => this.store.select(selectSelectedDay)),
      switchMap(([, selectedDay]) => {
        if (selectedDay.id) {
          return this.dayService.getDayById(selectedDay.id).pipe(
            map(day => DayApiActions.retrieveTodaySuccess({ day })),
            catchError((error: HttpErrorResponse) =>
              of(DayApiActions.retrieveTodayFailure({ errorMsg: error.message }))
            )
          );
        } else {
          return this.dayService.getToday().pipe(
            map(day => DayApiActions.retrieveTodaySuccess({ day })),
            catchError((error: HttpErrorResponse) =>
              of(DayApiActions.retrieveTodayFailure({ errorMsg: error.message }))
            )
          );
        }
      })
    );
  });

  getPreviousDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.getPreviousDay),
      concatLatestFrom(() => [this.store.select(selectPreviousDayFromDayList), this.store.select(selectSelectedDay)]),
      switchMap(([_, previousDay, selectedDay]) => {
        if (previousDay) return of(DayApiActions.retrieveNextDaySuccess({ day: previousDay }));

        return this.dayService.getPrevious(selectedDay).pipe(
          map(day => DayApiActions.retrievePreviousDaySuccess({ day })),
          catchError((error: HttpErrorResponse) =>
            of(DayApiActions.retrievePreviousDayFailure({ errorMsg: error.message }))
          )
        );
      })
    );
  });

  getNextDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.getNextDay),
      concatLatestFrom(() => [this.store.select(selectNextDayFromDayList), this.store.select(selectSelectedDay)]),
      switchMap(([_, nextDay, selectedDay]) => {
        if (nextDay) return of(DayApiActions.retrieveNextDaySuccess({ day: nextDay }));

        return this.dayService.getNext(selectedDay).pipe(
          map(day => DayApiActions.retrieveNextDaySuccess({ day })),
          catchError((error: HttpErrorResponse) =>
            of(DayApiActions.retrieveNextDayFailure({ errorMsg: error.message }))
          )
        );
      })
    );
  });

  setSelectedDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayApiActions.retrievePreviousDaySuccess, DayApiActions.retrieveNextDaySuccess),
      switchMap(action => of(DayActions.setSelectedDay({ day: action.day })))
    );
  });

  setDayByDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.setDayByDate),
      switchMap(action =>
        this.dayService.getDayByDate(action.date).pipe(
          map(day => DayApiActions.retrieveTodaySuccess({ day })),
          catchError((error: HttpErrorResponse) => of(DayApiActions.retrieveTodayFailure({ errorMsg: error.message })))
        )
      )
    );
  });

  loadDayList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.getDayList),
      switchMap(() =>
        this.dayService.getAllDays().pipe(
          map(dayList => DayApiActions.retrieveDayListSuccess({ dayList })),
          catchError((error: HttpErrorResponse) =>
            of(DayApiActions.retrieveDayListFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  loadDayListBetween$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.getDayListBetween),
      switchMap(({ date1, date2 }) =>
        this.dayService.getDaysBetween(date1, date2).pipe(
          map(dayList => DayApiActions.retrieveDayListSuccess({ dayList })),
          catchError((error: HttpErrorResponse) =>
            of(DayApiActions.retrieveDayListFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  saveEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.saveEvent),
      switchMap(({ event }) => {
        if (!event.name) {
          // Dispatch removeEvent action for events with empty names
          return of(DayActions.removeEvent({ event }));
        } else {
          // Dispatch updateEvent action for events with non-empty names
          return of(DayActions.updateEvent({ event }));
        }
      })
    );
  });

  saveSelectedDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        DayActions.saveDay,
        DayActions.addEvent,
        DayActions.removeEvent,
        DayActions.updateEvent,
        DayActions.moveEvent,
        DayActions.combineEvents
      ),
      concatLatestFrom(() => this.store.select(selectSelectedDay)),
      switchMap(([_, selectedDay]) => {
        // Delete day if last event removed
        if (!selectedDay.events.length) return of(DayActions.deleteDay({ day: selectedDay }));

        return this.dayService.saveDay(selectedDay).pipe(
          map(day => DayApiActions.saveDaySuccess({ day })),
          catchError((error: HttpErrorResponse) => of(DayApiActions.saveDayFailure({ errorMsg: error.message })))
        );
      })
    );
  });

  deleteDay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.deleteDay),
      switchMap(action =>
        this.dayService.deleteById(action.day.id || "").pipe(
          map(() => DayApiActions.deleteDaySuccess({ day: action.day })),
          catchError((error: HttpErrorResponse) => of(DayApiActions.deleteDayFailure({ errorMsg: error.message })))
        )
      )
    );
  });

  handleCalendarMonthChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DayActions.setCalendarMonth),
      switchMap(action => {
        const monthData = action.month;
        const monthDate = new Date(monthData.year, monthData.month, 1);

        return of(DayActions.setDayByDate({ date: monthDate }));
      })
    );
  });

  // Save multiple days

  reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => of(DayActions.reset()))
    );
  });
}
