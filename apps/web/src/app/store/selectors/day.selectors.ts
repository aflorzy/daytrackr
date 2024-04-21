import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Day } from "../../interfaces";
import { State as DayState } from "../reducers/day.reducer";

// Feature Selector
export const selectDayState = createFeatureSelector<DayState>("days");

// Individual Selectors
export const selectSelectedDay = createSelector(selectDayState, (state: DayState): Day => state.selectedDay);

export const selectDayList = createSelector(selectDayState, (state: DayState): Day[] => state.dayList);

export const selectCurrentDate = createSelector(selectDayState, (state: DayState): Date => state.currentDate);

export const selectErrorMsg = createSelector(selectDayState, (state: DayState): string => state.errorMsg);

export const selectExistsNextDay = createSelector(selectDayState, (state: DayState): boolean => {
  // Can't be next day if the latest saved day doesn't exist
  if (!state.latestDay.id) return false;

  return new Date(state.selectedDay.date) < new Date(state.latestDay.date);
});

export const selectExistsPreviousDay = createSelector(selectDayState, (state: DayState): boolean => {
  // Can't be previous day if the oldest saved day doesn't exist
  if (!state.oldestDay.id) return false;

  return new Date(state.selectedDay.date) > new Date(state.oldestDay.date);
});

export const selectPreviousDayFromDayList = createSelector(selectDayState, (state: DayState): Day | null => {
  if (!state.selectedDay.id) {
    const reversedDayList: Day[] = [...state.dayList].reverse();
    const previousDay = reversedDayList.find((day: Day) => new Date(day.date) < new Date(state.selectedDay.date));

    return previousDay ?? null;
  }

  const selectedDayIndex: number = findSelectedDayIndex(state.dayList, state.selectedDay);

  return selectedDayIndex === -1 || selectedDayIndex - 1 < 0 ? null : state.dayList[selectedDayIndex - 1];
});

export const selectNextDayFromDayList = createSelector(selectDayState, (state: DayState): Day | null => {
  if (!state.selectedDay.id) {
    const nextDay = state.dayList.find((day: Day) => new Date(day.date) > new Date(state.selectedDay.date));

    return nextDay ?? null;
  }

  const selectedDayIndex: number = findSelectedDayIndex(state.dayList, state.selectedDay);

  return selectedDayIndex === -1 || selectedDayIndex + 1 === state.dayList.length
    ? null
    : state.dayList[selectedDayIndex + 1];
});

export const selectOldestDay = createSelector(
  selectDayState,
  (state: DayState): Day => state.oldestDay ?? state.selectedDay
);
export const selectLatestDay = createSelector(
  selectDayState,
  (state: DayState): Day => state.latestDay ?? state.selectedDay
);

export const selectCalendarMonthDropdownData = createSelector(
  selectOldestDay,
  selectLatestDay,
  selectSelectedDay,
  selectCurrentDate,
  (oldest: Day, latest: Day, selected: Day, current: Date): { month: number; year: number }[] => {
    const monthsData: { month: number; year: number }[] = [];

    const oldestDate = new Date(oldest.date);
    const latestDate = new Date(latest.date);
    const selectedDate = new Date(selected.date);
    const currentDate = new Date(current);

    const oldestMonth = oldestDate.getUTCMonth();
    const oldestYear = oldestDate.getUTCFullYear();

    const tempDate = new Date(oldestYear, oldestMonth);

    const maxDate: Date = new Date(Math.max(selectedDate.getTime(), latestDate.getTime(), currentDate.getTime()));

    while (tempDate <= maxDate) {
      monthsData.unshift({ month: tempDate.getUTCMonth(), year: tempDate.getUTCFullYear() });
      tempDate.setUTCMonth(tempDate.getUTCMonth() + 1);
    }

    return monthsData;
  }
);

function findSelectedDayIndex(dayList: Day[], selectedDay: Day): number {
  return dayList.findIndex((day: Day) => day.id === selectedDay.id);
}
