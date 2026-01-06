import { createReducer, on } from "@ngrx/store";
import { Day, Event } from "@fzt/calendar";
import { DayActions, DayApiActions } from "../actions/day.actions";

export interface State {
  selectedDay: Day;
  oldestDay: Day;
  latestDay: Day;
  dayList: Day[];
  currentDate: Date;
  errorMsg: string;
  loading: boolean;
}

export const initialState: State = {
  selectedDay: {
    events: [],
    date: getTodayDate()
  },
  oldestDay: {
    events: [],
    date: getTodayDate()
  },
  latestDay: {
    events: [],
    date: getTodayDate()
  },
  dayList: [],
  currentDate: getTodayDate(),
  errorMsg: "",
  loading: false
};

export const dayReducer = createReducer(
  initialState,
  on(
    DayActions.setDayList,
    (state, { dayList }): State => ({
      ...state,
      dayList
    })
  ),
  on(
    DayActions.addDay,
    (state, { date }): State => ({
      ...state,
      selectedDay: { date, events: [] },
      dayList: [...state.dayList, { date, events: [] }]
    })
  ),
  on(
    DayActions.saveDay,
    DayActions.setSelectedDay,
    (state, { day }): State => ({
      ...state,
      selectedDay: day
    })
  ),
  on(
    DayActions.selectDay,
    (state, { id }): State => ({
      ...state,
      selectedDay:
        (state.dayList.find((day: Day) => day.id === id) ?? state.dayList.length)
          ? state.dayList[state.dayList.length - 1]
          : { date: state.currentDate, events: [] }
    })
  ),
  on(DayActions.addEvent, (state, { name }): State => {
    const event: Event = { name, idx: state.selectedDay.events.length };
    return {
      ...state,
      selectedDay: { ...state.selectedDay, events: [...state.selectedDay.events, event] }
    };
  }),
  on(DayActions.removeEvent, (state, { event }): State => {
    const selectedDay: Day = { ...state.selectedDay, events: [...state.selectedDay.events] };
    selectedDay.events.splice(event.idx, 1);

    return {
      ...state,
      selectedDay
    };
  }),
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
  on(DayActions.updateEvent, (state, { event }): State => {
    // Event should delete if name == ""
    const selectedDay: Day = { ...state.selectedDay, events: [...state.selectedDay.events] };
    selectedDay.events.splice(event.idx, 1, event);

    return {
      ...state,
      selectedDay
    };
  }),
  on(DayActions.moveEvent, (state, { event, newIdx }): State => {
    const temp: Event = state.selectedDay.events[newIdx];
    const events: Event[] = [...state.selectedDay.events];
    events[newIdx] = events[event.idx];
    events[event.idx] = temp;

    return {
      ...state,
      selectedDay: {
        ...state.selectedDay,
        events: reorderEvents(events)
      }
    };
  }),
  on(DayActions.combineEvents, (state, { event1, event2 }): State => {
    const tempEvent: Event = {
      idx: event1.idx,
      name: `${event1.name}, ${event2.name}`
    };
    const events: Event[] = [...state.selectedDay.events];
    events[tempEvent.idx] = tempEvent;
    events.splice(event2.idx, 1);

    return {
      ...state,
      selectedDay: {
        ...state.selectedDay,
        events: reorderEvents(events)
      }
    };
  }),
  on(DayApiActions.saveDaySuccess, (state, { day }): State => ({ ...state, selectedDay: day })),
  on(DayApiActions.retrieveDayListSuccess, (state, { dayList }): State => ({ ...state, dayList })),
  on(DayApiActions.retrieveCurrentDateSuccess, (state, { currentDate }): State => ({ ...state, currentDate })),
  on(
    DayApiActions.retrieveTodaySuccess,
    (state, { day }): State => ({ ...state, selectedDay: day || { date: getTodayDate(), events: [] } })
  ),
  on(
    DayApiActions.retrieveOldestDaySuccess,
    (state, { day }): State => ({
      ...state,
      oldestDay: day
    })
  ),
  on(
    DayApiActions.retrieveLatestDaySuccess,
    (state, { day }): State => ({
      ...state,
      latestDay: day
    })
  ),
  on(
    DayApiActions.deleteDaySuccess,
    (state, { day }): State => ({
      ...state,
      dayList: state.dayList.filter((dayTemp: Day) => dayTemp.id !== day.id),
      selectedDay: { date: day.date, events: [] }
    })
  ),

  // Overwrite selectedDay in dayList
  on(
    DayActions.addDay,
    DayActions.selectDay,
    DayActions.addEvent,
    DayActions.removeEvent,
    DayActions.insertEvent,
    DayActions.updateEvent,
    DayActions.moveEvent,
    DayActions.combineEvents,
    DayApiActions.deleteDaySuccess,
    (state): State => {
      const selectedDayIndex: number = findSelectedDayIndex(state.dayList, state.selectedDay);
      const dayList: Day[] = [...state.dayList];
      dayList.splice(selectedDayIndex, 1, state.selectedDay);

      return { ...state, dayList };
    }
  ),

  // Reset global error message
  on(
    DayApiActions.saveDaySuccess,
    DayApiActions.retrieveDayListSuccess,
    DayApiActions.retrieveCurrentDateSuccess,
    DayApiActions.retrieveTodaySuccess,
    DayApiActions.retrieveOldestDaySuccess,
    DayApiActions.retrieveLatestDaySuccess,
    DayApiActions.retrievePreviousDaySuccess,
    DayApiActions.retrieveNextDaySuccess,
    DayApiActions.deleteDaySuccess,
    (state): State => ({ ...state, errorMsg: "" })
  ),
  // Set global error message
  on(
    DayApiActions.saveDayFailure,
    DayApiActions.retrieveDayListFailure,
    DayApiActions.retrieveCurrentDateFailure,
    DayApiActions.retrieveTodayFailure,
    DayApiActions.retrieveOldestDayFailure,
    DayApiActions.retrieveLatestDayFailure,
    DayApiActions.retrievePreviousDayFailure,
    DayApiActions.retrieveNextDayFailure,
    DayApiActions.deleteDayFailure,
    (state, { errorMsg }): State => ({ ...state, errorMsg })
  ),

  // Reset global loading indicator
  on(
    DayApiActions.saveDaySuccess,
    DayApiActions.saveDayFailure,
    DayApiActions.retrieveDayListSuccess,
    DayApiActions.retrieveDayListFailure,
    DayApiActions.retrieveCurrentDateSuccess,
    DayApiActions.retrieveCurrentDateFailure,
    DayApiActions.retrieveTodaySuccess,
    DayApiActions.retrieveTodayFailure,
    DayApiActions.retrieveOldestDaySuccess,
    DayApiActions.retrieveOldestDayFailure,
    DayApiActions.retrieveLatestDaySuccess,
    DayApiActions.retrieveLatestDayFailure,
    DayApiActions.retrievePreviousDaySuccess,
    DayApiActions.retrievePreviousDayFailure,
    DayApiActions.retrieveNextDaySuccess,
    DayApiActions.retrieveNextDayFailure,
    DayApiActions.deleteDaySuccess,
    DayApiActions.deleteDayFailure,
    (state): State => ({ ...state, loading: false })
  ),
  // Set global loading indicator
  on(
    DayActions.getDayList,
    DayActions.getDayListBetween,
    DayActions.setInitialDay,
    DayActions.setOldestDay,
    DayActions.setLatestDay,
    DayActions.addEvent,
    DayActions.removeEvent,
    DayActions.updateEvent,
    DayActions.moveEvent,
    DayActions.combineEvents,
    DayActions.deleteDay,
    (state): State => ({ ...state, loading: true })
  ),
  on(DayActions.reset, (): State => ({ ...initialState }))
);

function reorderEvents(events: Event[]): Event[] {
  return events.map((event: Event, index: number) => ({ ...event, idx: index }));
}

function findSelectedDayIndex(dayList: Day[], selectedDay: Day): number {
  return dayList.findIndex((day: Day) => day.id === selectedDay.id);
}

export function getTodayDate(): Date {
  const today: Date = new Date();
  const year: number = today.getUTCFullYear();
  const month = (today.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = today.getUTCDate().toString().padStart(2, "0");
  const dayStr = `${year}/${month}/${day}`;

  return new Date(dayStr);
}
