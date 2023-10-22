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

  constructor(private datePipe: DatePipe, private dayService: DayService) {}
  ngOnInit(): void {
    // get days from local storage
    this.days$ = this.dayService.getAllDays();
    this.days$.subscribe((days) => {
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
  }

  dateChange(e: any) {
    const date = e.target.value;
    const day = this.days.find((d) => this.datePipe.transform(d.date, 'yyyy-MM-dd') === date);

    let dateInput = document.getElementById('date') as HTMLInputElement;
    dateInput.value = date || '';

    this.selectedDay = day;

    if (!day) return;
    const foundIndex = this.days.findIndex((day) => day.date === this.selectedDay?.date);
    if (foundIndex === -1) return;
    this.existsPrev = foundIndex > 0;
    this.existsNext = foundIndex < this.days.length - 1;
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
