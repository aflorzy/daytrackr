import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { Day as DayObj } from "src/common/interfaces";
import { CalendarDay, CalendarMonth, CalendarWeek } from "src/common/interfaces";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {
  monthList: CalendarMonth[] = [];
  monthListInitial: CalendarMonth[] = [];
  selectedDate?: Date;

  /* CALENDAR DATA FROM HOLDINGS PAGE */
  INITIAL_DAY_OBJ: DayObj = {
    date: new Date(),
    events: []
  };
  INITIAL_DAY: CalendarDay = {
    date: -1,
    month: -1,
    year: -1,
    dayOfWeek: -1,
    dayOfWeekStr: "",
    weekOfMonth: -1,
    weekOfYear: -1,
    monthStrAbbv: "",
    monthStr: "",
    day: this.INITIAL_DAY_OBJ
  };

  INITIAL_WEEK: CalendarWeek = {
    days: Array(7).fill(this.INITIAL_DAY),
    weekOfYear: -1,
    weekOfMonth: -1
  };

  INITIAL_MONTH: CalendarMonth = {
    weeks: Array(6).fill(this.INITIAL_WEEK),
    name: "",
    monthOfYear: -1,
    year: -1
  };

  @Output() dayChange = new EventEmitter<CalendarDay>();
  @Output() newDayClick = new EventEmitter<CalendarDay>();
  @Output() firstLastDate = new EventEmitter<{ first: Date; last: Date }>();
  @Input() deletedDay$ = new Subject<DayObj>();
  @Input() set dayList(dayList: DayObj[]) {
    // Loop through dayList and set on appropriate calendar day
    dayList.forEach((day: DayObj) => {
      this.monthList = this.monthListInitial.map((calendarMonth: CalendarMonth) => ({
        ...calendarMonth,
        weeks: calendarMonth.weeks.map((calendarWeek: CalendarWeek) => ({
          ...calendarWeek,
          days: calendarWeek.days.map((calendarDay: CalendarDay) => {
            const yearNum: number = +(this.datePipe.transform(day.date, "yyyy") ?? "");
            const monthNum: number = +(this.datePipe.transform(day.date, "MM") ?? "");
            const dayNum: number = +(this.datePipe.transform(day.date, "dd") ?? "");
            if (calendarDay.year == yearNum && calendarDay.month == monthNum && calendarDay.date == dayNum) {
              calendarDay.day = day;
            }

            return calendarDay;
          })
        }))
      }));
    });
  }

  @Input() set initializeCalendar(date: Date) {
    const monthChanged: boolean =
      this.datePipe.transform(this.selectedDate, "MM") !== this.datePipe.transform(date, "MM");
    const shouldEmitFirstLast: boolean = !this.selectedDate || monthChanged;
    this.selectedDate = date;

    if (!shouldEmitFirstLast) return;

    const currentMonth: CalendarMonth = {
      ...this.monthFromDate(date)
    };

    const previousMonthDate: Date = new Date(date);
    previousMonthDate.setDate(15);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const previousMonth: CalendarMonth = {
      ...this.monthFromDate(previousMonthDate)
    };

    const nextMonthDate: Date = new Date(date);
    nextMonthDate.setDate(15);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonth: CalendarMonth = { ...this.monthFromDate(nextMonthDate) };

    this.monthList = [previousMonth, currentMonth, nextMonth];
    this.monthListInitial = [...this.monthList];

    // Only emit these when month has changed
    if (shouldEmitFirstLast) {
      this.firstLastDate.emit({
        first: previousMonth.weeks[0].days[0].day.date,
        last: nextMonth.weeks[5].days[6].day.date
      });
    }
  }

  constructor(private datePipe: DatePipe) {}
  ngOnInit(): void {
    this.subscribeDeletedDay();
  }

  subscribeDeletedDay() {
    this.deletedDay$.subscribe((deletedDay: DayObj) => {
      // Set day's events to []
      this.monthList = this.monthListInitial.map((calendarMonth: CalendarMonth) => ({
        ...calendarMonth,
        weeks: calendarMonth.weeks.map((calendarWeek: CalendarWeek) => ({
          ...calendarWeek,
          days: calendarWeek.days.map((calendarDay: CalendarDay) => {
            const yearNum: number = +(this.datePipe.transform(deletedDay.date, "yyyy") ?? "");
            const monthNum: number = +(this.datePipe.transform(deletedDay.date, "MM") ?? "");
            const dayNum: number = +(this.datePipe.transform(deletedDay.date, "dd") ?? "");
            if (calendarDay.year == yearNum && calendarDay.month == monthNum && calendarDay.date == dayNum) {
              calendarDay.day.events = [];
            }

            return calendarDay;
          })
        }))
      }));
    });
  }

  /* Calendar Methods */
  dayFromDate(dateObj: Date): CalendarDay {
    const date = this.datePipe.transform(dateObj, "d");
    const month = this.datePipe.transform(dateObj, "M");
    const year = this.datePipe.transform(dateObj, "y");
    const dayOfWeek = this.datePipe.transform(dateObj, "c");
    const dayOfWeekStr = this.datePipe.transform(dateObj, "ccc");
    const weekOfMonth = this.datePipe.transform(dateObj, "W");
    const weekOfYear = this.datePipe.transform(dateObj, "w");
    const monthStr = this.datePipe.transform(dateObj, "LLL");
    const monthStrAbbv = this.datePipe.transform(dateObj, "LLLL");

    const day: CalendarDay = {
      date: date ? +date : -1,
      month: month ? +month : -1,
      year: year ? +year : -1,
      dayOfWeek: dayOfWeek ? +dayOfWeek : -1,
      dayOfWeekStr: dayOfWeekStr ? dayOfWeekStr : "",
      weekOfMonth: weekOfMonth ? +weekOfMonth : -1,
      weekOfYear: weekOfYear ? +weekOfYear : -1,
      monthStr: monthStr ? monthStr : "",
      monthStrAbbv: monthStrAbbv ? monthStrAbbv : "",
      day: {
        ...this.INITIAL_DAY_OBJ,
        date: new Date(`${year}-${month}-${date}`)
      }
    };

    day.day.date = new Date(`${day.year}/${day.month}/${day.date}`);

    return day;
  }

  weekFromDate(dateObj: Date): CalendarWeek {
    const day: CalendarDay = this.dayFromDate(dateObj);

    const firstDayOfWeekObj: Date = new Date(dateObj);
    firstDayOfWeekObj.setDate(firstDayOfWeekObj.getDate() - day.dayOfWeek);

    const week: CalendarWeek = this.INITIAL_WEEK;
    week.days = week.days.map((dayTemp: CalendarDay, dayOfWeek: number) => {
      const dayOfWeekTemp: Date = new Date(firstDayOfWeekObj);
      dayOfWeekTemp.setDate(dayOfWeekTemp.getDate() + dayOfWeek);
      return this.dayFromDate(dayOfWeekTemp);
    });

    week.weekOfYear = week.days[3].weekOfYear;
    week.weekOfMonth = week.days[3].weekOfMonth;
    return week;
  }

  monthFromDate(dateObj: Date): CalendarMonth {
    const month: CalendarMonth = this.INITIAL_MONTH;
    const firstDayOfMonthObj: Date = new Date(dateObj);
    firstDayOfMonthObj.setDate(1);

    month.weeks = month.weeks.map((weekTemp: CalendarWeek, weekOfMonth: number) => {
      const dayOfWeekTemp: Date = new Date(firstDayOfMonthObj);
      dayOfWeekTemp.setDate(dayOfWeekTemp.getDate() + 7 * weekOfMonth);
      const week: CalendarWeek = this.weekFromDate(new Date(dayOfWeekTemp));
      return JSON.parse(JSON.stringify(week));
    });

    // Extract month name from date in middle of month (to avoid first and last weeks)
    month.name = month.weeks[2].days[3].monthStrAbbv;
    month.monthOfYear = month.weeks[2].days[3].month;
    month.year = month.weeks[2].days[3].year;

    return month;
  }

  selectDay(day: CalendarDay, month: CalendarMonth) {
    if (day.month !== month.monthOfYear) return;
    if (day.day.events.length <= 0) {
      this.newDayClick.emit(day);
      return;
    }
    this.dayChange.emit(day);
  }
}
