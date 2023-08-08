import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Day {
  date: Date;
  events: Event[];
}

export interface Event {
  name: string;
  index: number;
}

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css'],
})
export class InputBoxComponent implements OnInit {
  value: string = '';
  realInitialDate?: Date;
  initialDate?: Date;
  invalidDate: boolean = true;
  date?: Date;
  days: Day[] = [];
  DAYS_OF_WEEK: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  daysSaved: boolean = false;

  error$: Subject<any> = new BehaviorSubject({ isError: false, errorMsg: '' });

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initFields();
  }

  initFields() {
    if (localStorage.getItem('fields')) {
      const fields = JSON.parse(localStorage.getItem('fields')!);
      if (fields.date && fields.text) {
        this.initialDate = new Date(fields.date);
        this.value = fields.text;
      }
    }

    if (localStorage.getItem('days')) {
      this.daysSaved = true;
    }
  }

  setError(isError: boolean, errorMsg: string) {
    this.error$.next({ isError: isError, errorMsg: errorMsg });

    if (isError) this.reset();
  }

  reset() {
    this.days = [];
    this.initialDate = this.realInitialDate
      ? this.realInitialDate
      : this.initialDate;
    this.date = undefined;
  }

  onSubmit() {
    let errorMsg = '';
    let days: Day[] = [];
    let dayOfWeekIdx = -1;
    this.realInitialDate = this.initialDate;
    this.value.split('\n').forEach((line, index1) => {
      line = line.trim();
      if (line === '') {
        // Ignore empty lines
        return;
      }

      // Check if line starts with DAY_OF_WEEK
      let dayOfWeek = this.DAYS_OF_WEEK.find((day, index) =>
        line.startsWith(day + '-')
      );

      if (!dayOfWeek) {
        // Did not find 'Saturday-'... at beginning of line
        errorMsg = `Error parsing day at line ${index1}. '${line}'`;
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }

      if (
        dayOfWeekIdx !== -1 &&
        this.DAYS_OF_WEEK.indexOf(dayOfWeek) !== dayOfWeekIdx + 1 &&
        !(
          this.DAYS_OF_WEEK.indexOf(dayOfWeek) === 0 &&
          dayOfWeekIdx === this.DAYS_OF_WEEK.length - 1
        )
      ) {
        errorMsg = `Dates out of order at line ${index1}. Expected ${
          this.DAYS_OF_WEEK[
            dayOfWeekIdx + 1 >= this.DAYS_OF_WEEK.length ? 0 : dayOfWeekIdx + 1
          ]
        } but got ${dayOfWeek}. '${line}'`;
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }

      // Expect day to equal datePipe.transform of initialDate
      if (!this.initialDate) {
        errorMsg = 'Initial date not set!';
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }
      this.date = new Date(this.initialDate);
      let expectedDay = this.datePipe.transform(this.date, 'EEEE');

      if (dayOfWeek !== expectedDay) {
        errorMsg = `Expected date at line ${index1} to be ${expectedDay} but got ${dayOfWeek}. '${line}'`;
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }

      dayOfWeekIdx = this.DAYS_OF_WEEK.indexOf(dayOfWeek);
      line = line.replace(dayOfWeek + '-', '');

      const day: Day = {
        date: this.date,
        events: line
          .split(',')
          .map((event, index) => ({ name: event.trim(), index: index })),
      };

      // Remove empty events
      day.events = day.events.filter((event) => event.name !== '');

      days.push(day);

      let newDate = new Date(this.initialDate);
      newDate.setDate(newDate.getDate() + 1);
      this.initialDate = newDate;
    });

    this.initialDate = this.realInitialDate;
    this.date = undefined;
    this.days = days;
    errorMsg = '';
    this.setError(false, errorMsg);

    // If all success, save input to localStorage
    localStorage.setItem(
      'fields',
      JSON.stringify({ date: this.realInitialDate, text: this.value })
    );
  }

  saveData() {
    // Loop through events and replace all &nbsp; with spaces
    const daysFinal: Day[] = this.days.map((day) => {
      const events: Event[] = day.events.map((event) => {
        return { ...event, name: event.name.replace(/&nbsp;/g, ' ') };
      });

      return { ...day, events };
    });

    localStorage.setItem('days', JSON.stringify(daysFinal));
    this.daysSaved = true;
  }
}
