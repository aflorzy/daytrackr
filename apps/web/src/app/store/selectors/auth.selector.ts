"@ngrx/store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccessToken, ResponseMessage } from "../../interfaces";
import { State as AuthState } from "../reducers/auth.reducer";

// Feature Selector
export const selectAuthState = createFeatureSelector<AuthState>("auth");

// Individual Selectors
export const selectToken = createSelector(selectAuthState, (state: AuthState): AccessToken => state.token);

export const selectIsAuthenticatedUser = createSelector(
  selectAuthState,
  (state: AuthState): boolean => state.isAuthenticatedUser
);

export const selectLoading = createSelector(selectAuthState, (state: AuthState): boolean => state.loading);

export const selectErrorMsg = createSelector(selectAuthState, (state: AuthState): string => state.errorMsg);

export const selectResponseMsg = createSelector(
  selectAuthState,
  (state: AuthState): ResponseMessage => state.responseMsg
);
