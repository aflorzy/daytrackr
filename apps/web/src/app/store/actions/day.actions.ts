import { createActionGroup, props } from "@ngrx/store";
import { Day, Event } from "src/app/interfaces";

export const DayActions = createActionGroup({
  source: "Day",
  events: {
    "Add Day": props<{ date: Date }>(),
    "Remove Day": props<{ id: string }>(),
    "Select Day": props<{ id: string }>(),
    "Add Event": props<{ event: Event }>(),
    "Remove Event": props<{ event: Event }>(),
    "Insert Event": props<{ event: Event }>()
  }
});

export const DayApiActions = createActionGroup({
  source: "Day API",
  events: {
    "Retrieved Day List": props<{ dayList: Day[] }>(),
    "Retrieved Current Date": props<{ currentDate: Date }>()
  }
});
