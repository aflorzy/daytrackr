import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Day, Event } from "src/app/interfaces";

export const DayActions = createActionGroup({
  source: "Day",
  events: {
    initializeCalendarPage: emptyProps(),
    getDayList: emptyProps(),
    getDayListBetween: props<{ date1: Date; date2: Date }>(),
    setDayList: props<{ dayList: Day[] }>(),
    addDay: props<{ date: Date }>(),
    deleteDay: props<{ day: Day }>(),
    setInitialDay: emptyProps(),
    setSelectedDay: props<{ day: Day }>(),
    setOldestDay: emptyProps(),
    setLatestDay: emptyProps(),
    selectDay: props<{ id: string }>(),
    setDayByDate: props<{ date: Date }>(),
    saveDay: props<{ day: Day }>(),
    addEvent: props<{ name: string }>(),
    saveEvent: props<{ event: Event }>(),
    removeEvent: props<{ event: Event }>(),
    insertEvent: props<{ event: Event }>(),
    updateEvent: props<{ event: Event }>(),
    moveEvent: props<{ event: Event; newIdx: number }>(),
    combineEvents: props<{ event1: Event; event2: Event }>(),
    getNextDay: emptyProps(),
    getPreviousDay: emptyProps(),
    setCalendarMonth: props<{ month: { month: number; year: number } }>(),
    reset: emptyProps()
  }
});

export const DayApiActions = createActionGroup({
  source: "Day API",
  events: {
    saveDaySuccess: props<{ day: Day }>(),
    saveDayFailure: props<{ errorMsg: string }>(),
    retrieveDayListSuccess: props<{ dayList: Day[] }>(),
    retrieveDayListFailure: props<{ errorMsg: string }>(),
    retrieveCurrentDateSuccess: props<{ currentDate: Date }>(),
    retrieveCurrentDateFailure: props<{ errorMsg: string }>(),
    retrieveTodaySuccess: props<{ day: Day }>(),
    retrieveTodayFailure: props<{ errorMsg: string }>(),
    retrieveOldestDaySuccess: props<{ day: Day }>(),
    retrieveOldestDayFailure: props<{ errorMsg: string }>(),
    retrieveLatestDaySuccess: props<{ day: Day }>(),
    retrieveLatestDayFailure: props<{ errorMsg: string }>(),
    retrievePreviousDaySuccess: props<{ day: Day }>(),
    retrievePreviousDayFailure: props<{ errorMsg: string }>(),
    retrieveNextDaySuccess: props<{ day: Day }>(),
    retrieveNextDayFailure: props<{ errorMsg: string }>(),
    deleteDaySuccess: props<{ day: Day }>(),
    deleteDayFailure: props<{ errorMsg: string }>()
  }
});
