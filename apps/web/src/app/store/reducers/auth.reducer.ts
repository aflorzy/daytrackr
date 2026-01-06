import { createReducer, on } from "@ngrx/store";
import { StatusType } from "../../enums";
import { AccessToken, ResponseMessage } from "../../interfaces";
import { AuthActions } from "../actions/auth.actions";

export interface Loading {
  login: boolean;
  register: boolean;
}

export interface State {
  token: AccessToken | null;
  loading: Loading;
  responseMsg: ResponseMessage | null;
}

export const initialState: State = {
  token: null,
  loading: {
    login: false,
    register: false
  },
  responseMsg: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setToken, (state, { token }): State => ({ ...state, token })),
  on(
    AuthActions.register,
    (state): State => ({
      ...state,
      loading: { ...state.loading, register: true },
      responseMsg: null
    })
  ),
  on(
    AuthActions.login,
    (state): State => ({
      ...state,
      loading: { ...state.loading, login: true },
      responseMsg: null
    })
  ),
  on(AuthActions.logout, (state): State => ({ ...state, token: null })),
  on(
    AuthActions.registerSuccess,
    (state): State => ({
      ...state,
      loading: { ...state.loading, register: false },
      responseMsg: {
        message: "Successfully registered! Please login using your new credentials.",
        statusType: StatusType.SUCCESS
      }
    })
  ),
  on(
    AuthActions.registerFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: { ...state.loading, register: false },
      responseMsg: {
        message: errorMsg,
        statusType: StatusType.ERROR
      }
    })
  ),
  on(
    AuthActions.loginSuccess,
    (state, { token }): State => ({
      ...state,
      token,
      loading: { ...state.loading, login: false }
    })
  ),
  on(
    AuthActions.loginFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: { ...state.loading, login: false },
      responseMsg: {
        message: errorMsg,
        statusType: StatusType.ERROR
      }
    })
  ),
  on(AuthActions.reset, (): State => ({ ...initialState }))
);
