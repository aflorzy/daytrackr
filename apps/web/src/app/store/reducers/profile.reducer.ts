import { createReducer, on } from "@ngrx/store";
import { StatusType } from "../../enums";
import { ProfileDTO, ResponseMessage } from "../../interfaces";
import { ProfileActions, ProfileApiActions } from "../actions/profile.actions";

export interface State {
  profile: ProfileDTO | null;
  touched: boolean;
  loading: boolean;
  errorMsg: string;
  responseMsg: ResponseMessage;
}

export const initialState: State = {
  profile: null,
  touched: false,
  loading: false,
  errorMsg: "",
  responseMsg: {
    message: "",
    statusType: StatusType.NULL
  }
};

export const profileReducer = createReducer(
  initialState,

  on(ProfileApiActions.retrieveProfileSuccess, (state, { profileDto }): State => ({ ...state, profile: profileDto })),

  // Reset global loading indicator
  on(
    ProfileApiActions.retrieveProfileSuccess,
    ProfileApiActions.retrieveProfileFailure,
    (state): State => ({ ...state, loading: false })
  ),

  // Set global loading indicator
  on(
    ProfileActions.getProfileDetails,
    ProfileActions.saveProfileDetails,
    (state): State => ({ ...state, loading: true })
  ),

  // Reset global error message
  on(ProfileApiActions.retrieveProfileSuccess, (state): State => ({ ...state, errorMsg: "" })),

  // Set global error message
  on(ProfileApiActions.retrieveProfileFailure, (state, { errorMsg }): State => ({ ...state, errorMsg })),

  // Set global status message
  on(
    ProfileActions.setResponseMessage,
    ProfileApiActions.saveProfileSuccess,
    (state, { responseMsg }): State => ({ ...state, responseMsg })
  ),
  on(ProfileActions.reset, (): State => ({ ...initialState }))
);
