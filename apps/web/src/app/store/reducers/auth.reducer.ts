import { createReducer, on } from "@ngrx/store";
import { AuthActions, AuthApiActions } from "../actions/auth.actions";
import { AccessToken, ResponseMessage } from "src/app/interfaces";
import { StatusType } from "src/app/enums";

export interface State {
  token: AccessToken;
  isAuthenticatedUser: boolean;
  loading: boolean;
  errorMsg: string;
  responseMsg: ResponseMessage;
}

export const initialState: State = {
  token: {
    accessToken: "",
    tokenType: ""
  },
  isAuthenticatedUser: false,
  loading: false,
  errorMsg: "",
  responseMsg: {
    message: "",
    statusType: StatusType.NULL
  }
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.setToken, (state, { token }): State => {
    return { ...state, token };
  }),

  on(AuthActions.setIsAuthenticatedUser, (state, { isAuthenticatedUser }): State => {
    return { ...state, isAuthenticatedUser };
  }),

  // Reset global loading indicator
  on(
    AuthApiActions.registerSuccess,
    AuthApiActions.registerFailure,
    AuthApiActions.loginSuccess,
    AuthApiActions.loginFailure,
    (state): State => ({ ...state, loading: false })
  ),

  // Set global loading indicator
  on(AuthActions.login, AuthActions.register, (state): State => ({ ...state, loading: true })),

  // Reset global error message
  on(AuthApiActions.registerSuccess, AuthApiActions.loginSuccess, (state): State => ({ ...state, errorMsg: "" })),

  // Set global error message
  on(
    AuthApiActions.registerFailure,
    AuthApiActions.loginFailure,
    (state, { errorMsg }): State => ({ ...state, errorMsg })
  ),

  // Update response message after successful registration
  on(
    AuthApiActions.registerSuccess,
    (state, { message }): State => ({
      ...state,
      responseMsg: {
        message: message,
        statusType: StatusType.SUCCESS
      }
    })
  ),

  // Update response message after failed registration
  on(
    AuthApiActions.registerFailure,
    (state, { errorMsg }): State => ({
      ...state,
      responseMsg: {
        message: errorMsg,
        statusType: StatusType.ERROR
      }
    })
  ),

  // Update response message after successful login
  on(AuthApiActions.loginSuccess, (state): State => {
    return {
      ...state,
      responseMsg: {
        message: "Successfully logged in",
        statusType: StatusType.SUCCESS
      }
    };
  }),

  // Update response message after failed login
  on(
    AuthApiActions.loginFailure,
    (state): State => ({
      ...state,
      responseMsg: {
        message: "Failed to login. Please check your credentials",
        statusType: StatusType.ERROR
      }
    })
  ),

  // Set global status message
  on(AuthActions.setResponseMessage, (state, { responseMsg }): State => ({ ...state, responseMsg }))
);
