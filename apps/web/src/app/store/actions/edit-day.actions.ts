import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Day, Event } from "../../interfaces";

export const EditDayActions = createActionGroup({
  source: "Edit Day",
  events: {
    "Load Day": emptyProps(),
    "Delete Day": props<{ day: Day }>(),
    "Save Edits": emptyProps(),
    "Cancel Edits": emptyProps(),
    "Add Event": props<{ name: string }>(),
    "Remove Event": props<{ event: Event }>(),
    "Insert Event": props<{ event: Event }>(),
    "Update Event": props<{ event: Event }>(),
    "Move Event": props<{ event: Event; newIdx: number }>(),
    "Move Event Up": props<{ event: Event }>(),
    "Move Event Down": props<{ event: Event }>(),
    "Combine Events": props<{ event1: Event; event2: Event }>()
  }
});

export const EditDayApiActions = createActionGroup({
  source: "Edit Day API",
  events: {
    "Load Day Success": props<{ day: Day }>(),
    "Load Day Failure": props<{ errorMsg: string }>(),
    "Save Edits Success": props<{ day: Day }>(),
    "Save Edits Failure": props<{ errorMsg: string }>(),
    "Delete Day Success": props<{ day: Day }>(),
    "Delete Day Failure": props<{ errorMsg: string }>()
  }
});
