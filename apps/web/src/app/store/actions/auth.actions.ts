import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AccessToken, ResponseMessage } from "src/app/interfaces";

export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    Login: props<{ username: string; password: string }>(),
    Register: props<{ username: string; password: string }>(),
    Logout: emptyProps(),
    "Expire Token": emptyProps(),
    "Set Token": props<{ token: AccessToken }>(),
    "Set Is Authenticated User": props<{ isAuthenticatedUser: boolean }>(),
    "Set Response Message": props<{ responseMsg: ResponseMessage }>(),
    "Check For Token": emptyProps()
  }
});

export const AuthApiActions = createActionGroup({
  source: "Auth API",
  events: {
    "Login Success": props<{ token: AccessToken }>(),
    "Login Failure": props<{ errorMsg: string }>(),
    "Register Success": props<{ message: string }>(),
    "Register Failure": props<{ errorMsg: string }>()
  }
});
