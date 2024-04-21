import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Day, Event } from "src/app/interfaces";

export const DayActions = createActionGroup({
  source: "Day",
  events: {
    "Initialize Calendar Page": emptyProps(),
    "Get Day List": emptyProps(),
    "Get Day List Between": props<{ date1: Date; date2: Date }>(),
    "Set Day List": props<{ dayList: Day[] }>(),
    "Add Day": props<{ date: Date }>(),
    "Delete Day": props<{ day: Day }>(),
    "Set Initial Day": emptyProps(),
    "Set Selected Day": props<{ day: Day }>(),
    "Set Oldest Day": emptyProps(),
    "Set Latest Day": emptyProps(),
    "Select Day": props<{ id: string }>(),
    "Set Day By Date": props<{ date: Date }>(),
    "Save Day": props<{ day: Day }>(),
    "Add Event": props<{ name: string }>(),
    "Save Event": props<{ event: Event }>(),
    "Remove Event": props<{ event: Event }>(),
    "Insert Event": props<{ event: Event }>(),
    "Update Event": props<{ event: Event }>(),
    "Move Event": props<{ event: Event; newIdx: number }>(),
    "Combine Events": props<{ event1: Event; event2: Event }>(),
    "Get Next Day": emptyProps(),
    "Get Previous Day": emptyProps(),
    "Set Calendar Month": props<{ month: { month: number; year: number } }>()
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
    "Retrieve Oldest Day Success": props<{ day: Day }>(),
    "Retrieve Oldest Day Failure": props<{ errorMsg: string }>(),
    "Retrieve Latest Day Success": props<{ day: Day }>(),
    "Retrieve Latest Day Failure": props<{ errorMsg: string }>(),
    "Retrieve Previous Day Success": props<{ day: Day }>(),
    "Retrieve Previous Day Failure": props<{ errorMsg: string }>(),
    "Retrieve Next Day Success": props<{ day: Day }>(),
    "Retrieve Next Day Failure": props<{ errorMsg: string }>(),
    "Delete Day Success": props<{ day: Day }>(),
    "Delete Day Failure": props<{ errorMsg: string }>()
  }
});
