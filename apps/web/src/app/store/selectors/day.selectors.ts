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
  if (!state.dayList.length) return false;

  // SelectedDay might not be saved yet, but next button should still function if date is less than last in list
  if (!state.selectedDay.id) {
    return new Date(state.selectedDay.date) < new Date(state.dayList[state.dayList.length - 1].date);
  }

  const selectedDayIndex: number = findSelectedDayIndex(state.dayList, state.selectedDay);
  return selectedDayIndex !== -1 && selectedDayIndex < state.dayList.length - 1;
});

export const selectExistsPreviousDay = createSelector(selectDayState, (state: DayState): boolean => {
  if (!state.dayList.length) return false;

  // SelectedDay might not be saved yet, but next button should still function if date is less than last in list
  if (!state.selectedDay.id) {
    return new Date(state.selectedDay.date) > new Date(state.dayList[0].date);
  }

  const selectedDayIndex: number = findSelectedDayIndex(state.dayList, state.selectedDay);
  return selectedDayIndex > 0;
});

function findSelectedDayIndex(dayList: Day[], selectedDay: Day): number {
  return dayList.findIndex((day: Day) => day.id === selectedDay.id);
}
