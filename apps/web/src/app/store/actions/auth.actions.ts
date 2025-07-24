import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AccessToken } from "../../interfaces";

export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    login: props<{ username: string; password: string }>(),
    register: props<{ username: string; password: string }>(),
    logout: emptyProps(),
    checkForToken: emptyProps(),
    setToken: props<{ token: AccessToken }>(),
    expireToken: emptyProps(),
    extendSession: emptyProps(),
    refreshTokenSuccess: props<{ token: AccessToken }>(),
    loginSuccess: props<{ token: AccessToken }>(),
    loginFailure: props<{ errorMsg: string }>(),
    registerSuccess: emptyProps(),
    registerFailure: props<{ errorMsg: string }>(),
    reset: emptyProps()
  }
});
