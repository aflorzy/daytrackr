import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Day, Event } from "@fzt/calendar";

export const EditDayActions = createActionGroup({
  source: "Edit Day",
  events: {
    loadDay: emptyProps(),
    deleteDay: props<{ day: Day }>(),
    saveEdits: emptyProps(),
    cancelEdits: emptyProps(),
    addEvent: props<{ name: string }>(),
    removeEvent: props<{ event: Event }>(),
    insertEvent: props<{ event: Event }>(),
    updateEvent: props<{ event: Event }>(),
    moveEvent: props<{ event: Event; newIdx: number }>(),
    moveEventUp: props<{ event: Event }>(),
    moveEventDown: props<{ event: Event }>(),
    combineEvents: props<{ event1: Event; event2: Event }>(),
    reset: emptyProps()
  }
});

export const EditDayApiActions = createActionGroup({
  source: "Edit Day API",
  events: {
    loadDaySuccess: props<{ day: Day }>(),
    loadDayFailure: props<{ errorMsg: string }>(),
    saveEditsSuccess: props<{ day: Day }>(),
    saveEditsFailure: props<{ errorMsg: string }>(),
    deleteDaySuccess: props<{ day: Day }>(),
    deleteDayFailure: props<{ errorMsg: string }>()
  }
});
