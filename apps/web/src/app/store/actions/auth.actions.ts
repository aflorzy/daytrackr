import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AccessToken } from "../../interfaces";

export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    Login: props<{ username: string; password: string }>(),
    Register: props<{ username: string; password: string }>(),
    Logout: emptyProps(),
    "Check for Token": emptyProps(),
    "Set Token": props<{ token: AccessToken }>(),
    "Expire Token": emptyProps(),
    "Extend Session": emptyProps(),
    "Login Success": props<{ token: AccessToken }>(),
    "Login Failure": props<{ errorMsg: string }>(),
    "Register Success": emptyProps(),
    "Register Failure": props<{ errorMsg: string }>(),
    Reset: emptyProps()
  }
});
