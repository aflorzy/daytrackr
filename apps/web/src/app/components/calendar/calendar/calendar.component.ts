import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Day as DayObj } from '../../input-box/input-box.component';

interface Month {
  weeks: Week[];
  name: string;
  monthOfYear: number;
  year: number;
}
interface Week {
  days: Day[];
  weekOfYear: number;
  weekOfMonth: number;
}
interface Day {
  date: number;
  month: number;
  year: number;
  dayOfWeek: number;
  dayOfWeekStr: string;
  weekOfMonth: number;
  weekOfYear: number;
  monthStrAbbv: string;
  monthStr: string;
  day: DayObj;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  monthList: Month[] = [];
  selectedDate?: Date;

  /* CALENDAR DATA FROM HOLDINGS PAGE */
  INITIAL_DAY_OBJ: DayObj = {
    date: new Date(),
    events: [],
  };
  INITIAL_DAY: Day = {
    date: -1,
    month: -1,
    year: -1,
    dayOfWeek: -1,
    dayOfWeekStr: '',
    weekOfMonth: -1,
    weekOfYear: -1,
    monthStrAbbv: '',
    monthStr: '',
    day: this.INITIAL_DAY_OBJ,
  };

  INITIAL_WEEK: Week = {
    days: Array(7).fill(this.INITIAL_DAY),
    weekOfYear: -1,
    weekOfMonth: -1,
  };

  INITIAL_MONTH: Month = {
    weeks: Array(6).fill(this.INITIAL_WEEK),
    name: '',
    monthOfYear: -1,
    year: -1,
  };

  constructor(private datePipe: DatePipe) {}

  @Output() dateChange = new EventEmitter<{ target: { value: string } }>();

  @Input() dayList: DayObj[] = [];

  @Input() set initializeCalendar(date: Date) {
    this.selectedDate = date;
    const currentMonth: Month = {
      ...this.monthFromDate(date),
    };

    let previousMaturityDate: Date = new Date(date);
    previousMaturityDate.setDate(15);
    previousMaturityDate.setMonth(previousMaturityDate.getMonth() - 1);
    const previousMonth: Month = {
      ...this.monthFromDate(previousMaturityDate),
    };

    let nextMaturityDate: Date = new Date(date);
    nextMaturityDate.setDate(15);
    nextMaturityDate.setMonth(nextMaturityDate.getMonth() + 1);
    const nextMonth: Month = { ...this.monthFromDate(nextMaturityDate) };

    this.monthList = [previousMonth, currentMonth, nextMonth];
  }

  /* Calendar Methods */
  dayFromDate(dateObj: Date): Day {
    let date = this.datePipe.transform(dateObj, 'd');
    let month = this.datePipe.transform(dateObj, 'M');
    let year = this.datePipe.transform(dateObj, 'y');
    let dayOfWeek = this.datePipe.transform(dateObj, 'c');
    let dayOfWeekStr = this.datePipe.transform(dateObj, 'ccc');
    let weekOfMonth = this.datePipe.transform(dateObj, 'W');
    let weekOfYear = this.datePipe.transform(dateObj, 'w');
    let monthStr = this.datePipe.transform(dateObj, 'LLL');
    let monthStrAbbv = this.datePipe.transform(dateObj, 'LLLL');

    let day: Day = {
      date: date ? +date : -1,
      month: month ? +month : -1,
      year: year ? +year : -1,
      dayOfWeek: dayOfWeek ? +dayOfWeek : -1,
      dayOfWeekStr: dayOfWeekStr ? dayOfWeekStr : '',
      weekOfMonth: weekOfMonth ? +weekOfMonth : -1,
      weekOfYear: weekOfYear ? +weekOfYear : -1,
      monthStr: monthStr ? monthStr : '',
      monthStrAbbv: monthStrAbbv ? monthStrAbbv : '',
      day:
        this.dayList.find((dayObj: DayObj) => {
          return (
            +(this.datePipe.transform(dayObj.date, 'dd')?.toString() || '') ===
              +(date?.toString() || '') &&
            +(this.datePipe.transform(dayObj.date, 'MM')?.toString() || '') ===
              +(month?.toString() || '') &&
            +(
              this.datePipe.transform(dayObj.date, 'yyyy')?.toString() || ''
            ) === +(year?.toString() || '')
          );
        }) || this.INITIAL_DAY_OBJ,
    };

    return day;
  }

  weekFromDate(dateObj: Date): Week {
    let day: Day = this.dayFromDate(dateObj);

    let firstDayOfWeekObj: Date = new Date(dateObj);
    firstDayOfWeekObj.setDate(firstDayOfWeekObj.getDate() - day.dayOfWeek);

    let week: Week = this.INITIAL_WEEK;
    week.days = week.days.map((dayTemp: Day, dayOfWeek: number) => {
      let dayOfWeekTemp: Date = new Date(firstDayOfWeekObj);
      dayOfWeekTemp.setDate(dayOfWeekTemp.getDate() + dayOfWeek);
      return this.dayFromDate(dayOfWeekTemp);
    });

    week.weekOfYear = week.days[3].weekOfYear;
    week.weekOfMonth = week.days[3].weekOfMonth;
    return week;
  }

  monthFromDate(dateObj: Date): Month {
    let month: Month = this.INITIAL_MONTH;
    let firstDayOfMonthObj: Date = new Date(dateObj);
    firstDayOfMonthObj.setDate(1);

    month.weeks = month.weeks.map((weekTemp: Week, weekOfMonth: number) => {
      let dayOfWeekTemp: Date = new Date(firstDayOfMonthObj);
      dayOfWeekTemp.setDate(dayOfWeekTemp.getDate() + 7 * weekOfMonth);
      let week: Week = this.weekFromDate(new Date(dayOfWeekTemp));
      return JSON.parse(JSON.stringify(week));
    });

    // Extract month name from date in middle of month (to avoid first and last weeks)
    month.name = month.weeks[2].days[3].monthStrAbbv;
    month.monthOfYear = month.weeks[2].days[3].month;
    month.year = month.weeks[2].days[3].year;

    return month;
  }

  selectDay(day: Day, month: Month) {
    if (day.day.events.length <= 0) return;
    if (day.month !== month.monthOfYear) return;

    const value = day.day.date;
    this.initializeCalendar = value;
    this.dateChange.emit({
      target: { value: this.datePipe.transform(value, 'yyyy-MM-dd') || '' },
    });
  }
}
