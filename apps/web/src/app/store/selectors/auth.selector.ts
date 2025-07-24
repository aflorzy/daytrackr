"@ngrx/store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccessToken, ResponseMessage } from "../../interfaces";
import { State as AuthState } from "../reducers/auth.reducer";

// Feature Selector
export const selectAuthState = createFeatureSelector<AuthState>("auth");

// Individual Selectors
export const selectToken = createSelector(selectAuthState, (state: AuthState): AccessToken | null => state.token);

export const selectIsAuthenticatedUser = createSelector(selectAuthState, (state: AuthState): boolean => !!state.token);

export const selectRegisterIsLoading = createSelector(selectAuthState, (state): boolean => state.loading.register);
export const selectLoginIsLoading = createSelector(selectAuthState, (state): boolean => state.loading.login);

export const selectResponseMsg = createSelector(selectAuthState, (state): ResponseMessage | null => state.responseMsg);
