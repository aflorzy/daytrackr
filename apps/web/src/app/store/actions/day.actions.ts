import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Day, Event } from "src/app/interfaces";

export const DayActions = createActionGroup({
  source: "Day",
  events: {
    "Get Day List": emptyProps(),
    "Get Day List Between": props<{ date1: Date; date2: Date }>(),
    "Set Day List": props<{ dayList: Day[] }>(),
    "Add Day": props<{ date: Date }>(),
    "Delete Day": props<{ day: Day }>(),
    "Set Initial Day": emptyProps(),
    "Set Selected Day": props<{ day: Day }>(),
    "Select Day": props<{ id: string }>(),
    "Save Day": props<{ day: Day }>(),
    "Add Event": props<{ name: string }>(),
    "Save Event": props<{ event: Event }>(),
    "Remove Event": props<{ event: Event }>(),
    "Insert Event": props<{ event: Event }>(),
    "Update Event": props<{ event: Event }>(),
    "Move Event": props<{ event: Event; newIdx: number }>(),
    "Combine Events": props<{ event1: Event; event2: Event }>(),
    "Select Next Day": emptyProps(),
    "Select Previous Day": emptyProps()
  }
});

export const DayApiActions = createActionGroup({
  source: "Day API",
  events: {
    "Save Day Success": props<{ day: Day }>(),
    "Save Day Failure": props<{ errorMsg: string }>(),
    "Retrieve Day List Success": props<{ dayList: Day[] }>(),
    "Retrieve Day List Failure": props<{ errorMsg: string }>(),
    "Retrieve Current Date Success": props<{ currentDate: Date }>(),
    "Retrieve Current Date Failure": props<{ errorMsg: string }>(),
    "Retrieve Today Success": props<{ day: Day }>(),
    "Retrieve Today Failure": props<{ errorMsg: string }>(),
    "Delete Day Success": props<{ day: Day }>(),
    "Delete Day Failure": props<{ errorMsg: string }>()
  }
});
