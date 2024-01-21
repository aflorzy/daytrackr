import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Observable, Subject } from "rxjs";
import { DayService } from "src/app/services/day.service";
import { StatusType } from "../../enums";
import { CalendarDay, Day } from "../../interfaces";

@UntilDestroy()
@Component({
  selector: "app-calendar-page",
  templateUrl: "./calendar-page.component.html",
  styleUrls: ["./calendar-page.component.css"]
})
export class CalendarPageComponent implements OnInit {
  days: Day[] = [];
  selectedDay?: Day;
  minDate!: Date;
  maxDate!: Date;
  firstCalendarDate!: Date;
  lastCalendarDate!: Date;
  firstLastDate$ = new Subject<{ first: Date; last: Date }>();
  deletedDay$ = new Subject<Day>();
  existsPrev = false;
  existsNext = false;
  editing = false;
  days$!: Observable<Day[]>;
  errorMessage = "";
  warnMessage = "";

  constructor(
    private datePipe: DatePipe,
    private dayService: DayService
  ) {}

  ngOnInit(): void {
    this.subscribeInitialDay();
    this.subscribeCalendarChange();
  }

  get StatusType() {
    return StatusType;
  }

  subscribeInitialDay() {
    this.dayService
      .getTodayOrLatest()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (day: Day) => {
          this.selectedDay = day;
        },
        error: e => {
          console.error(e);
        }
      });
  }

  subscribeCalendarChange() {
    this.firstLastDate$.pipe(untilDestroyed(this)).subscribe({
      next: dates => {
        if (!dates.first || !dates.last) return;

        this.dayService
          .getDaysBetween(dates.first, dates.last)
          .pipe(untilDestroyed(this))
          .subscribe(days => {
            if (days.length === 0) return;

            this.days = days;

            const dateInput = document.getElementById("date") as HTMLInputElement;
            this.minDate = new Date(days[0].date);
            this.maxDate = new Date(days[days.length - 1].date);

            this.existsPrev = days.length > 1;
            this.existsNext = false;

            if (dateInput) {
              dateInput.setAttribute("max", this.datePipe.transform(days[days.length - 1].date, "yyyy-MM-dd") || "");
              dateInput.value = this.datePipe.transform(this.selectedDay?.date, "yyyy-MM-dd") || "";
            }
          });
      },
      error: (e: any) => {
        this.warnMessage = "No days available";
      }
    });
  }

  dayChange(calendarDay: CalendarDay) {
    this.selectedDay = calendarDay.day;
    const foundIndex = this.days.findIndex(day => day.date === this.selectedDay?.date);
    this.existsPrev = foundIndex > 0;
    this.existsNext = foundIndex < this.days.length - 1;
  }

  newDayClick(calendarDay: CalendarDay) {
    this.selectedDay = calendarDay.day;
  }

  setFirstLastCalendarDates(dates: { first: Date; last: Date }) {
    this.firstLastDate$.next(dates);
  }

  onPrev() {
    const foundIndex = this.days.findIndex(day => day.date === this.selectedDay?.date);
    if (foundIndex === -1 || foundIndex === 0) return;

    const found = this.days[foundIndex - 1];
    this.selectedDay = found;
    this.existsPrev = foundIndex > 1;
    this.existsNext = foundIndex <= this.days.length - 1;

    const dateInput = document.getElementById("date") as HTMLInputElement;
    const date = this.datePipe.transform(found.date, "yyyy-MM-dd");
    dateInput.value = date || "";
  }

  onNext() {
    const foundIndex = this.days.findIndex(day => day.date === this.selectedDay?.date);
    if (foundIndex === -1 || foundIndex === this.days.length - 1) return;

    const found = this.days[foundIndex + 1];
    this.selectedDay = found;
    this.existsPrev = foundIndex >= 0;
    this.existsNext = foundIndex < this.days.length - 2;

    const dateInput = document.getElementById("date") as HTMLInputElement;
    const date = this.datePipe.transform(found.date, "yyyy-MM-dd");
    dateInput.value = date || "";
  }

  handleSave(day: Day) {
    this.selectedDay = day;
  }

  onDelete(deleted: boolean) {
    if (!deleted || !this.selectedDay || !this.selectedDay.id) return;

    this.dayService
      .deleteById(this.selectedDay.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: _ => {
          if (!this.selectedDay) return;
          // Trigger calendar to remove day's events
          this.deletedDay$.next(this.selectedDay);

          // Filter out of list
          let tempSelectedDay: Day | undefined;
          let deletedFirst: boolean;
          this.days = this.days.filter((day: Day) => {
            const found: boolean = day.id === this.selectedDay?.id;

            if (deletedFirst && !tempSelectedDay) {
              // Deleted first day in list. Others exist
              tempSelectedDay = day;
              this.selectedDay = day;
            }

            if (found && tempSelectedDay) {
              this.selectedDay = tempSelectedDay;
            } else if (found) {
              // Deleted first day in list. Others may or may not exist
              deletedFirst = true;
            } else {
              tempSelectedDay = day;
            }

            // Do not want to keep deleted day
            return !found;
          });

          if (!tempSelectedDay) {
            // Delete only item in list
            this.selectedDay = undefined;
          }
        },
        error: _ => {
          console.error("Could not delete day");
        }
      });
  }

  onSubmit(day: Day) {
    this.dayService
      .saveDay(day)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: Day) => {
          if (this.selectedDay) {
            this.selectedDay.id = res.id;
          }
        },
        error: e => {
          console.error(e);
        }
      });
  }
}
