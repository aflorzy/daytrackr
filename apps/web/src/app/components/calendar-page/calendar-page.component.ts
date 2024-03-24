import { Component, OnInit } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { RouterActions } from "src/app/store/actions/router.actions";
import { StatusType } from "../../enums";
import { CalendarDay, Day, Event } from "../../interfaces";
import { DayActions } from "../../store/actions/day.actions";
import {
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

@UntilDestroy()
@Component({
  selector: "app-calendar-page",
  templateUrl: "./calendar-page.component.html",
  styleUrls: ["./calendar-page.component.css"]
})
export class CalendarPageComponent implements OnInit {
  selectedDay$: Observable<Day> = this.store.select(selectSelectedDay);
  dayList$: Observable<Day[]> = this.store.select(selectDayList);
  existsPreviousDay$: Observable<boolean> = this.store.select(selectExistsPreviousDay);
  existsNextDay$: Observable<boolean> = this.store.select(selectExistsNextDay);

  constructor(private store: Store) {}

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
