import { Component, OnInit } from '@angular/core';
import { Day } from '../input-box/input-box.component';
import { DatePipe } from '@angular/common';
import { DayService } from 'src/app/services/day.service';
import { Observable } from 'rxjs';

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
    this.dayService.getTodayOrLatest().subscribe({
      next: (day: Day) => {
        this.selectedDay = day;
        // date1 = first date of previous month
        // date2 = last date of next month
        const previousMonth: Date = new Date(day.date);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        previousMonth.setDate(1);
        const nextMonth: Date = new Date(day.date);
        nextMonth.setMonth(nextMonth.getMonth() + 2);
        nextMonth.setDate(0);

        this.dayService.getDaysBetween(previousMonth, nextMonth).subscribe((days) => {
          // let days = JSON.parse(localStorage.getItem("days") || "[]");
          if (days.length === 0) return;

          this.days = days;

          let dateInput = document.getElementById('date') as HTMLInputElement;
          this.minDate = new Date(days[0].date);
          this.maxDate = new Date(days[days.length - 1].date);

          this.selectedDay = days[days.length - 1];
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

    // this.days$ = this.dayService.getAllDays();
    // this.days$.subscribe((days) => {
    //   // let days = JSON.parse(localStorage.getItem("days") || "[]");
    //   if (days.length === 0) return;

    //   this.days = days;

    //   let dateInput = document.getElementById('date') as HTMLInputElement;
    //   this.minDate = new Date(days[0].date);
    //   this.maxDate = new Date(days[days.length - 1].date);

    //   this.selectedDay = days[days.length - 1];
    //   this.existsPrev = days.length > 1;
    //   this.existsNext = false;

    //   if (dateInput) {
    //     dateInput.setAttribute('max', this.datePipe.transform(days[days.length - 1].date, 'yyyy-MM-dd') || '');
    //     dateInput.value = this.datePipe.transform(this.selectedDay?.date, 'yyyy-MM-dd') || '';
    //   }
    // });
  }

  dateChange(e: any) {
    const date = e.target.value;

    this.dayService.getDayByDate(date).subscribe({
      next: (day: Day) => {
        let dateInput = document.getElementById('date') as HTMLInputElement;
        dateInput.value = date || '';

        this.selectedDay = day;

        if (!day) return;
        const foundIndex = this.days.findIndex((day) => day.date === this.selectedDay?.date);
        if (foundIndex === -1) return;
        this.existsPrev = foundIndex > 0;
        this.existsNext = foundIndex < this.days.length - 1;
      },
      error: (e) => {
        this.errorMessage = `Could not retrieve day for ${date}`;
        console.error(this.errorMessage);
      },
    });
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
}
