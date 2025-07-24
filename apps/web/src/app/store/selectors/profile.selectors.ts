"@ngrx/store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProfileDTO, ResponseMessage } from "../../interfaces";
import { State as ProfileState } from "../reducers/profile.reducer";

// Feature Selector
export const selectProfileState = createFeatureSelector<ProfileState>("profile");

// Individual Selectors
export const selectProfile = createSelector(
  selectProfileState,
  (state: ProfileState): ProfileDTO | null => state.profile
);

export const selectTouched = createSelector(selectProfileState, (state: ProfileState): boolean => state.touched);

export const selectLoading = createSelector(selectProfileState, (state: ProfileState): boolean => state.loading);

export const selectErrorMsg = createSelector(selectProfileState, (state: ProfileState): string => state.errorMsg);

export const selectResponseMsg = createSelector(
  selectProfileState,
  (state: ProfileState): ResponseMessage => state.responseMsg
);
