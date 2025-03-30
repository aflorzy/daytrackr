import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ProfileDTO, ResponseMessage } from "src/app/interfaces";

export const ProfileActions = createActionGroup({
  source: "Profile",
  events: {
    getProfileDetails: emptyProps(),
    saveProfileDetails: props<{ profileDto: ProfileDTO }>(),
    setResponseMessage: props<{ responseMsg: ResponseMessage }>(),
    reset: emptyProps()
  }
});

export const ProfileApiActions = createActionGroup({
  source: "Profile API",
  events: {
    retrieveProfileSuccess: props<{ profileDto: ProfileDTO }>(),
    retrieveProfileFailure: props<{ errorMsg: string }>(),
    saveProfileSuccess: props<{ responseMsg: ResponseMessage }>(),
    saveProfileFailure: props<{ errorMsg: string }>()
  }
});
