import { createReducer, on } from "@ngrx/store";
import { Day, Event } from "@fzt/calendar";
import { EditDayActions, EditDayApiActions } from "../actions/edit-day.actions";

export interface State {
  day: Day;
  editingDay: Day;
  touched: boolean;
  loading: boolean;
  errorMsg: string;
}

export const initialState: State = {
  day: {
    events: [],
    date: new Date()
  },
  editingDay: {
    events: [],
    date: new Date()
  },
  touched: false,
  loading: false,
  errorMsg: ""
};

export const editDayReducer = createReducer(
  initialState,

  // Set editingDay to day so data is current IFF it is the first edit action
  on(
    EditDayActions.addEvent,
    EditDayActions.removeEvent,
    EditDayActions.updateEvent,
    EditDayActions.moveEvent,
    EditDayActions.combineEvents,
    (state): State => {
      if (state.touched) return { ...state };
      else return { ...state, editingDay: { ...state.day } };
    }
  ),
  // Set touched IFF it is the first edit action
  on(
    EditDayActions.addEvent,
    EditDayActions.removeEvent,
    EditDayActions.updateEvent,
    EditDayActions.moveEvent,
    EditDayActions.combineEvents,
    (state): State => ({ ...state, touched: true })
  ),

  on(EditDayActions.addEvent, (state, { name }): State => {
    const event: Event = { name, idx: state.editingDay.events.length };
    return {
      ...state,
      editingDay: { ...state.editingDay, events: [...state.editingDay.events, event] }
    };
  }),
  on(EditDayActions.removeEvent, (state, { event }): State => {
    const editingDay: Day = { ...state.editingDay, events: [...state.editingDay.events] };
    editingDay.events.splice(event.idx, 1);

    return {
      ...state,
      editingDay: {
        ...editingDay,
        events: reorderEvents(editingDay.events)
      }
    };
  }),
  on(EditDayActions.insertEvent, (state, { event }): State => {
    const editingDay: Day = { ...state.editingDay, events: [...state.editingDay.events] };
    editingDay.events.splice(event.idx, 0, event);

    return {
      ...state,
      editingDay: {
        ...editingDay,
        events: reorderEvents(editingDay.events)
      }
    };
  }),
  on(EditDayActions.updateEvent, (state, { event }): State => {
    const editingDay: Day = { ...state.editingDay, events: [...state.editingDay.events] };
    editingDay.events.splice(event.idx, 1, event);

    return {
      ...state,
      editingDay
    };
  }),
  on(EditDayActions.moveEvent, (state, { event, newIdx }): State => {
    const events: Event[] = [...state.editingDay.events];
    const [temp]: Event[] = events.splice(event.idx, 1);
    events.splice(newIdx, 0, temp);

    return {
      ...state,
      editingDay: {
        ...state.editingDay,
        events: reorderEvents(events)
      }
    };
  }),
  on(EditDayActions.combineEvents, (state, { event1, event2 }): State => {
    const tempEvent: Event = {
      idx: event1.idx,
      name: `${event1.name}, ${event2.name}`
    };
    const events: Event[] = [...state.editingDay.events];
    events[tempEvent.idx] = tempEvent;
    events.splice(event2.idx, 1);

    return {
      ...state,
      editingDay: {
        ...state.editingDay,
        events: reorderEvents(events)
      }
    };
  }),
  // Write editingEvent
  on(
    EditDayApiActions.loadDaySuccess,
    (state, { day }): State => ({
      ...state,
      editingDay: day
    })
  ),

  on(
    EditDayApiActions.loadDaySuccess,
    EditDayApiActions.saveEditsSuccess,
    (state, { day }): State => ({
      ...state,
      day
    })
  ),
  on(
    EditDayApiActions.saveEditsSuccess,
    EditDayActions.cancelEdits,
    (state): State => ({
      ...state,
      touched: false
    })
  ),

  // Reset isChanged by setting editingDay equal
  on(
    EditDayApiActions.saveEditsSuccess,
    EditDayActions.cancelEdits,
    (state): State => ({
      ...state,
      editingDay: { ...state.day }
    })
  ),

  on(
    EditDayApiActions.deleteDaySuccess,
    (state, { day }): State => ({
      ...state,
      day: { date: day.date, events: [] }
    })
  ),

  // Reset global loading indicator
  on(
    EditDayApiActions.loadDaySuccess,
    EditDayApiActions.loadDayFailure,
    EditDayApiActions.saveEditsSuccess,
    EditDayApiActions.saveEditsFailure,
    EditDayApiActions.deleteDaySuccess,
    EditDayApiActions.deleteDayFailure,
    (state): State => ({ ...state, loading: false })
  ),
  // Set global loading indicator
  on(
    EditDayActions.loadDay,
    EditDayActions.saveEdits,
    EditDayActions.deleteDay,
    (state): State => ({ ...state, loading: true })
  ),

  // Reset global error message
  on(
    EditDayApiActions.loadDaySuccess,
    EditDayApiActions.saveEditsSuccess,
    EditDayApiActions.deleteDaySuccess,
    (state): State => ({ ...state, errorMsg: "" })
  ),
  // Set global error message
  on(
    EditDayApiActions.loadDayFailure,
    EditDayApiActions.saveEditsFailure,
    EditDayApiActions.deleteDayFailure,
    (state, { errorMsg }): State => ({ ...state, errorMsg })
  ),
  on(EditDayActions.reset, (): State => ({ ...initialState }))
);

function reorderEvents(events: Event[]): Event[] {
  return events.map((event: Event, index: number) => ({ ...event, idx: index }));
}
