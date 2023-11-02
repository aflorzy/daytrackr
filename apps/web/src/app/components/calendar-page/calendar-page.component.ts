import { Component, OnInit } from '@angular/core';
import { CalendarDay, Day } from 'src/common/interfaces';
import { DatePipe } from '@angular/common';
import { DayService } from 'src/app/services/day.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
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
  existsPrev: boolean = false;
  existsNext: boolean = false;
  editing: boolean = false;
  days$!: Observable<Day[]>;
  errorMessage: string = '';
  warnMessage: string = '';

  constructor(private datePipe: DatePipe, private dayService: DayService) {}
  ngOnInit(): void {
    // get days from local storage
    // TODO: Get days for displayed months only. [currMonth-1,currMonth+1]
    // Start by getting today, else latest
    this.subscribeInitialDay();
    this.subscribeCalendarChange();
  }

  subscribeInitialDay() {
    this.dayService.getTodayOrLatest().subscribe({
      next: (day: Day) => {
        this.selectedDay = day;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  subscribeCalendarChange() {
    this.firstLastDate$.subscribe({
      next: (dates) => {
        if (!dates.first || !dates.last) return;

        this.dayService.getDaysBetween(dates.first, dates.last).subscribe((days) => {
          if (days.length === 0) return;

          this.days = days;

          let dateInput = document.getElementById('date') as HTMLInputElement;
          this.minDate = new Date(days[0].date);
          this.maxDate = new Date(days[days.length - 1].date);

          this.existsPrev = days.length > 1;
          this.existsNext = false;

          if (dateInput) {
            dateInput.setAttribute('max', this.datePipe.transform(days[days.length - 1].date, 'yyyy-MM-dd') || '');
            dateInput.value = this.datePipe.transform(this.selectedDay?.date, 'yyyy-MM-dd') || '';
          }
        });
      },
      error: (e: any) => {
        this.warnMessage = 'No days available';
      },
    });
  }

  dayChange(calendarDay: CalendarDay) {
    this.selectedDay = calendarDay.day;
    const foundIndex = this.days.findIndex((day) => day.date === this.selectedDay?.date);
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
    let foundIndex = this.days.findIndex((day) => day.date === this.selectedDay?.date);
    if (foundIndex === -1 || foundIndex === 0) return;

    const found = this.days[foundIndex - 1];
    this.selectedDay = found;
    this.existsPrev = foundIndex > 1;
    this.existsNext = foundIndex <= this.days.length - 1;

    let dateInput = document.getElementById('date') as HTMLInputElement;
    const date = this.datePipe.transform(found.date, 'yyyy-MM-dd');
    dateInput.value = date || '';
  }

  onNext() {
    let foundIndex = this.days.findIndex((day) => day.date === this.selectedDay?.date);
    if (foundIndex === -1 || foundIndex === this.days.length - 1) return;

    const found = this.days[foundIndex + 1];
    this.selectedDay = found;
    this.existsPrev = foundIndex >= 0;
    this.existsNext = foundIndex < this.days.length - 2;

    let dateInput = document.getElementById('date') as HTMLInputElement;
    const date = this.datePipe.transform(found.date, 'yyyy-MM-dd');
    dateInput.value = date || '';
  }

  handleSave(day: Day) {
    this.selectedDay = day;
  }

  onDelete(deleted: boolean) {
    if (!deleted || !this.selectedDay || !this.selectedDay.id) return;

    this.dayService.deleteById(this.selectedDay.id).subscribe({
      next: (_) => {
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
      error: (_) => {
        console.error('Could not delete day');
      },
    });
  }
}
