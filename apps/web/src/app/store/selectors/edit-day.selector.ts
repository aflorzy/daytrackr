"@ngrx/store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { isEqual } from "lodash";
import { Day } from "@fzt/calendar";
import { State as EditDayState } from "../reducers/edit-day.reducer";

// Feature Selector
export const selectEditDayState = createFeatureSelector<EditDayState>("editDay");

// Individual Selectors
export const selectDay = createSelector(selectEditDayState, (state: EditDayState): Day => state.day);

export const selectEditingDay = createSelector(selectEditDayState, (state: EditDayState): Day => state.editingDay);

export const selectTouched = createSelector(selectEditDayState, (state: EditDayState): boolean => state.touched);

export const selectIsChanged = createSelector(
  selectEditDayState,
  (state: EditDayState): boolean => !isEqual(state.day, state.editingDay)
);
