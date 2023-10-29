import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Day as DayObj } from 'src/common/interfaces';
import { CalendarDay, CalendarMonth, CalendarWeek } from 'src/common/interfaces';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  monthList: CalendarMonth[] = [];
  selectedDate?: Date;

  /* CALENDAR DATA FROM HOLDINGS PAGE */
  INITIAL_DAY_OBJ: DayObj = {
    date: new Date(),
    events: [],
  };
  INITIAL_DAY: CalendarDay = {
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

  INITIAL_WEEK: CalendarWeek = {
    days: Array(7).fill(this.INITIAL_DAY),
    weekOfYear: -1,
    weekOfMonth: -1,
  };

  INITIAL_MONTH: CalendarMonth = {
    weeks: Array(6).fill(this.INITIAL_WEEK),
    name: '',
    monthOfYear: -1,
    year: -1,
  };

  constructor(private datePipe: DatePipe) {}

  @Output() dayChange = new EventEmitter<CalendarDay>();
  @Output() firstLastDate = new EventEmitter<{ first: Date; last: Date }>();

  @Input() set dayList(dayList: DayObj[]) {
    // Loop through dayList and set on appropriate calendar day
    dayList.forEach((day: DayObj) => {
      this.monthList = this.monthList.map((calendarMonth: CalendarMonth) => ({
        ...calendarMonth,
        weeks: calendarMonth.weeks.map((calendarWeek: CalendarWeek) => ({
          ...calendarWeek,
          days: calendarWeek.days.map((calendarDay: CalendarDay) => {
            const yearNum: number = +(this.datePipe.transform(day.date, 'yyyy') ?? '');
            const monthNum: number = +(this.datePipe.transform(day.date, 'MM') ?? '');
            const dayNum: number = +(this.datePipe.transform(day.date, 'dd') ?? '');
            if (calendarDay.year == yearNum && calendarDay.month == monthNum && calendarDay.date == dayNum) {
              calendarDay.day = day;
            }

            return calendarDay;
          }),
        })),
      }));
    });
  }

  @Input() set initializeCalendar(date: Date) {
    const monthChanged: boolean = this.datePipe.transform(this.selectedDate, 'MM') !== this.datePipe.transform(date, 'MM');
    const shouldEmitFirstLast: boolean = !this.selectedDate || monthChanged;
    this.selectedDate = date;

    if (!shouldEmitFirstLast) return;


    const currentMonth: CalendarMonth = {
      ...this.monthFromDate(date),
    };

    let previousMonthDate: Date = new Date(date);
    previousMonthDate.setDate(15);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const previousMonth: CalendarMonth = {
      ...this.monthFromDate(previousMonthDate),
    };

    let nextMonthDate: Date = new Date(date);
    nextMonthDate.setDate(15);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonth: CalendarMonth = { ...this.monthFromDate(nextMonthDate) };

    this.monthList = [previousMonth, currentMonth, nextMonth];

    // Only emit these when month has changed
    if (shouldEmitFirstLast) {
      this.firstLastDate.emit({ first: previousMonth.weeks[0].days[0].day.date, last: nextMonth.weeks[5].days[6].day.date });
    }
  }

  /* Calendar Methods */
  dayFromDate(dateObj: Date): CalendarDay {
    let date = this.datePipe.transform(dateObj, 'd');
    let month = this.datePipe.transform(dateObj, 'M');
    let year = this.datePipe.transform(dateObj, 'y');
    let dayOfWeek = this.datePipe.transform(dateObj, 'c');
    let dayOfWeekStr = this.datePipe.transform(dateObj, 'ccc');
    let weekOfMonth = this.datePipe.transform(dateObj, 'W');
    let weekOfYear = this.datePipe.transform(dateObj, 'w');
    let monthStr = this.datePipe.transform(dateObj, 'LLL');
    let monthStrAbbv = this.datePipe.transform(dateObj, 'LLLL');

    let day: CalendarDay = {
      date: date ? +date : -1,
      month: month ? +month : -1,
      year: year ? +year : -1,
      dayOfWeek: dayOfWeek ? +dayOfWeek : -1,
      dayOfWeekStr: dayOfWeekStr ? dayOfWeekStr : '',
      weekOfMonth: weekOfMonth ? +weekOfMonth : -1,
      weekOfYear: weekOfYear ? +weekOfYear : -1,
      monthStr: monthStr ? monthStr : '',
      monthStrAbbv: monthStrAbbv ? monthStrAbbv : '',
      day: this.INITIAL_DAY_OBJ,
    };

    day.day.date = new Date(`${day.year}/${day.month}/${day.date}`);

    return day;
  }

  weekFromDate(dateObj: Date): CalendarWeek {
    let day: CalendarDay = this.dayFromDate(dateObj);

    let firstDayOfWeekObj: Date = new Date(dateObj);
    firstDayOfWeekObj.setDate(firstDayOfWeekObj.getDate() - day.dayOfWeek);

    let week: CalendarWeek = this.INITIAL_WEEK;
    week.days = week.days.map((dayTemp: CalendarDay, dayOfWeek: number) => {
      let dayOfWeekTemp: Date = new Date(firstDayOfWeekObj);
      dayOfWeekTemp.setDate(dayOfWeekTemp.getDate() + dayOfWeek);
      return this.dayFromDate(dayOfWeekTemp);
    });

    week.weekOfYear = week.days[3].weekOfYear;
    week.weekOfMonth = week.days[3].weekOfMonth;
    return week;
  }

  monthFromDate(dateObj: Date): CalendarMonth {
    let month: CalendarMonth = this.INITIAL_MONTH;
    let firstDayOfMonthObj: Date = new Date(dateObj);
    firstDayOfMonthObj.setDate(1);

    month.weeks = month.weeks.map((weekTemp: CalendarWeek, weekOfMonth: number) => {
      let dayOfWeekTemp: Date = new Date(firstDayOfMonthObj);
      dayOfWeekTemp.setDate(dayOfWeekTemp.getDate() + 7 * weekOfMonth);
      let week: CalendarWeek = this.weekFromDate(new Date(dayOfWeekTemp));
      return JSON.parse(JSON.stringify(week));
    });

    // Extract month name from date in middle of month (to avoid first and last weeks)
    month.name = month.weeks[2].days[3].monthStrAbbv;
    month.monthOfYear = month.weeks[2].days[3].month;
    month.year = month.weeks[2].days[3].year;

    return month;
  }

  selectDay(day: CalendarDay, month: CalendarMonth) {
    if (day.day.events.length <= 0) return;
    if (day.month !== month.monthOfYear) return;

    this.dayChange.emit(day);
  }
}
