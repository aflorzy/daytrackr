import { createReducer, on } from "@ngrx/store";
import { Day, Event } from "src/app/interfaces";
import { DayActions, DayApiActions } from "../actions/day.actions";

export interface State {
  selectedDay: Day;
  dayList: Day[];
  currentDate: Date;
}

export const initialState: State = {
  selectedDay: {
    events: [],
    date: new Date()
  },
  dayList: [],
  currentDate: new Date()
};

export const dayReducer = createReducer(
  initialState,
  on(
    DayActions.addDay,
    (state, { date }): State => ({
      ...state,
      selectedDay: { date, events: [] },
      dayList: [...state.dayList, { date, events: [] }]
    })
  ),
  on(
    DayActions.removeDay,
    (state, { id }): State => ({ ...state, dayList: state.dayList.filter((day: Day) => day.id !== id) })
  ),
  on(
    DayActions.selectDay,
    (state, { id }): State => ({
      ...state,
      selectedDay:
        state.dayList.find((day: Day) => day.id === id) ?? state.dayList.length
          ? state.dayList[state.dayList.length - 1]
          : { date: state.currentDate, events: [] }
    })
  ),
  on(
    DayActions.addEvent,
    (state, { event }): State => ({
      ...state,
      selectedDay: { ...state.selectedDay, events: [...state.selectedDay.events, event] }
    })
  ),
  on(
    DayActions.removeEvent,
    (state, { event }): State => ({
      ...state,
      selectedDay: {
        ...state.selectedDay,
        events: state.selectedDay.events.filter((e: Event) => e.idx === event.idx)
      }
    })
  ),
  on(
    DayActions.removeEvent,
    (state, { event }): State => ({
      ...state,
      selectedDay: {
        ...state.selectedDay,
        events: reorderEvents(state.selectedDay.events.filter((e: Event) => e.idx === event.idx))
      }
    })
  ),
  on(
    DayActions.insertEvent,
    (state, { event }): State => ({
      ...state,
      selectedDay: {
        ...state.selectedDay,
        events: reorderEvents(state.selectedDay.events.splice(event.idx, 0, event))
      }
    })
  ),
  on(DayApiActions.retrievedDayList, (state, { dayList }): State => ({ ...state, dayList })),
  on(DayApiActions.retrievedCurrentDate, (state, { currentDate }): State => ({ ...state, currentDate }))
);

function reorderEvents(events: Event[]): Event[] {
  return events.map((event: Event, index: number) => ({ ...event, idx: index }));
}
