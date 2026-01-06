import { Component, inject, OnInit } from "@angular/core";
import { CalendarDay, Day, Event } from "@fzt/calendar";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { StatusType } from "../../enums";
import { DayActions } from "../../store/actions/day.actions";
import { RouterActions } from "../../store/actions/router.actions";
import {
  selectCalendarMonthDropdownData,
  selectDayList,
  selectExistsNextDay,
  selectExistsPreviousDay,
  selectSelectedDay
} from "../../store/selectors/day.selectors";

/**
 * Assuming starting with an empty calendar, selectedDay should be current date.
 * Even if days are present, selectedDay should be current date.
 * If api.get(currentDate) exists, selectedDay = response
 * If api.get(currentDate) does not exist, selectedDay = current date (empty)
 * As soon as a new event is added, save selectedDay to the DB
 *  DB will return ID or Day obj, which will update in store
 *
 * If selectedDay has events, it exists in the DB
 */

@Component({
  selector: "app-calendar-page",
  templateUrl: "./calendar-page.component.html",
  styleUrls: ["./calendar-page.component.scss"]
})
export class CalendarPageComponent implements OnInit {
  private store = inject(Store);

  selectedDay$: Observable<Day> = this.store.select(selectSelectedDay);
  dayList$: Observable<Day[]> = this.store.select(selectDayList);
  existsPreviousDay$: Observable<boolean> = this.store.select(selectExistsPreviousDay);
  existsNextDay$: Observable<boolean> = this.store.select(selectExistsNextDay);
  monthDropdownData$: Observable<{ month: number; year: number }[]> = this.store.select(
    selectCalendarMonthDropdownData
  );

  ngOnInit(): void {
    this.store.dispatch(DayActions.initializeCalendarPage());
  }

  get StatusType() {
    return StatusType;
  }
  set selectedDay(day: Day) {
    this.store.dispatch(DayActions.setSelectedDay({ day }));
  }

  combineEvents(events: { event1: Event; event2: Event }) {
    this.store.dispatch(DayActions.combineEvents(events));
  }

  addEvent(name: string) {
    this.store.dispatch(DayActions.addEvent({ name }));
  }

  saveEvent(event: Event) {
    this.store.dispatch(DayActions.saveEvent({ event }));
  }

  getPreviousDay() {
    this.store.dispatch(DayActions.getPreviousDay());
  }

  getNextDay() {
    this.store.dispatch(DayActions.getNextDay());
  }

  deleteDay(selectedDay: Day) {
    if (!selectedDay || !selectedDay.id) return;

    this.store.dispatch(DayActions.deleteDay({ day: selectedDay }));
  }

  /** EDIT DAY FUNCTIONS */
  saveEditedDay(day: Day) {
    this.store.dispatch(DayActions.saveDay({ day }));
  }

  enterEditMode(selectedDay: Day) {
    this.store.dispatch(RouterActions.navigate({ route: `edit/${selectedDay.date}` }));
  }

  /** CALENDAR FUNCTIONS */
  dayChange(calendarDay: CalendarDay) {
    this.selectedDay = calendarDay.day;
  }

  monthChange(monthData: { month: number; year: number } | null) {
    if (!monthData) return;

    this.store.dispatch(DayActions.setCalendarMonth({ month: monthData }));
  }

  newDayClick(calendarDay: CalendarDay) {
    this.selectedDay = calendarDay.day;
  }

  setFirstLastCalendarDates(dates: { first: Date; last: Date }) {
    this.store.dispatch(DayActions.getDayListBetween({ date1: dates.first, date2: dates.last }));
  }

  /* DATE INPUT FUNCTIONS */
  counter = 0;
  handleDateInputChange(date: Date) {
    if (!date) return;
    if (this.counter > 3) return;
    this.counter++;
    this.store.dispatch(DayActions.setDayByDate({ date }));
  }
}
