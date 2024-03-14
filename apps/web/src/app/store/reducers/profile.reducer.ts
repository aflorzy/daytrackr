import { createReducer, on } from "@ngrx/store";
import { ProfileActions, ProfileApiActions } from "../actions/profile.actions";
import { ProfileDTO, ResponseMessage } from "src/app/interfaces";
import { StatusType } from "src/app/enums";

export interface State {
  profile: ProfileDTO;
  touched: boolean;
  loading: boolean;
  errorMsg: string;
  responseMsg: ResponseMessage;
}

export const initialState: State = {
  profile: {
    firstName: "",
    lastName: "",
    preferredName: "",
    email: "",
    phone: ""
  },
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
  )
);
