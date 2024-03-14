import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ProfileDTO, ResponseMessage } from "src/app/interfaces";

export const ProfileActions = createActionGroup({
  source: "Profile",
  events: {
    "Get Profile Details": emptyProps(),
    "Save Profile Details": props<{ profileDto: ProfileDTO }>(),
    "Set Response Message": props<{ responseMsg: ResponseMessage }>()
  }
});

export const ProfileApiActions = createActionGroup({
  source: "Profile API",
  events: {
    "Retrieve Profile Success": props<{ profileDto: ProfileDTO }>(),
    "Retrieve Profile Failure": props<{ errorMsg: string }>(),
    "Save Profile Success": props<{ responseMsg: ResponseMessage }>(),
    "Save Profile Failure": props<{ errorMsg: string }>()
  }
});
