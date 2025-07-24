import { DatePipe } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import { CalendarDay, CalendarMonth, CalendarWeek, Day } from "src/app/interfaces";

@Injectable({
  providedIn: "root"
})
export class CalendarService {
  private datePipe = inject(DatePipe);

  private readonly INITIAL_DAY_OBJ: Day = {
    date: new Date(),
    events: []
  };

  private readonly INITIAL_DAY: CalendarDay = {
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

  private readonly INITIAL_WEEK: CalendarWeek = {
    days: Array(7).fill(this.INITIAL_DAY),
    weekOfYear: -1,
    weekOfMonth: -1
  };

  private readonly INITIAL_MONTH: CalendarMonth = {
    weeks: Array(6).fill(this.INITIAL_WEEK),
    name: "",
    monthOfYear: -1,
    year: -1
  };

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
    firstDayOfWeekObj.setUTCDate(firstDayOfWeekObj.getUTCDate() - day.dayOfWeek);

    const week: CalendarWeek = this.INITIAL_WEEK;
    week.days = week.days.map((_: CalendarDay, dayOfWeek: number) => {
      const dayOfWeekTemp: Date = new Date(firstDayOfWeekObj);
      dayOfWeekTemp.setUTCDate(dayOfWeekTemp.getUTCDate() + dayOfWeek);
      return this.dayFromDate(dayOfWeekTemp);
    });

    week.weekOfYear = week.days[3].weekOfYear;
    week.weekOfMonth = week.days[3].weekOfMonth;
    return week;
  }

  monthFromDate(dateObj: Date): CalendarMonth {
    const month: CalendarMonth = this.INITIAL_MONTH;
    const firstDayOfMonthObj: Date = new Date(dateObj);

    firstDayOfMonthObj.setUTCDate(1);

    month.weeks = month.weeks.map((_: CalendarWeek, weekOfMonth: number) => {
      const dayOfWeekTemp: Date = new Date(firstDayOfMonthObj);
      dayOfWeekTemp.setUTCDate(dayOfWeekTemp.getUTCDate() + 7 * weekOfMonth);
      const week: CalendarWeek = this.weekFromDate(new Date(dayOfWeekTemp));
      return JSON.parse(JSON.stringify(week));
    });

    // Extract month name from date in middle of month (to avoid first and last weeks)
    month.name = month.weeks[2].days[3].monthStrAbbv;
    month.monthOfYear = month.weeks[2].days[3].month;
    month.year = month.weeks[2].days[3].year;

    return month;
  }

  initializeCalendar(date: Date, selectedDate?: Date): CalendarMonth[] | void {
    const monthChanged: boolean =
      this.datePipe.transform(selectedDate, "yyyy-MM") !== this.datePipe.transform(date, "yyyy-MM");

    const shouldEmitFirstLast: boolean = !selectedDate || monthChanged;

    if (!shouldEmitFirstLast) return;

    // Set date to 15 since calendar population does not care about selected day
    date = new Date(date);
    date.setUTCDate(15);

    const currentMonth: CalendarMonth = {
      ...this.monthFromDate(date)
    };

    const previousMonthDate: Date = new Date(date);
    previousMonthDate.setUTCMonth(previousMonthDate.getUTCMonth() - 1);
    previousMonthDate.setUTCDate(15);
    const previousMonth: CalendarMonth = {
      ...this.monthFromDate(previousMonthDate)
    };

    const nextMonthDate: Date = new Date(date);
    nextMonthDate.setUTCMonth(nextMonthDate.getUTCMonth() + 1);
    nextMonthDate.setUTCDate(15);
    const nextMonth: CalendarMonth = { ...this.monthFromDate(nextMonthDate) };

    return [previousMonth, currentMonth, nextMonth];
  }

  setDay(monthListInitial: CalendarMonth[], day: Day): CalendarMonth[] {
    return this.setDayEvents(monthListInitial, day, "set");
  }

  removeDay(monthListInitial: CalendarMonth[], day: Day): CalendarMonth[] {
    return this.setDayEvents(monthListInitial, day, "remove");
  }

  private setDayEvents(monthListInitial: CalendarMonth[], day: Day, mode: string): CalendarMonth[] {
    return monthListInitial.map((calendarMonth: CalendarMonth) => ({
      ...calendarMonth,
      weeks: calendarMonth.weeks.map((calendarWeek: CalendarWeek) => ({
        ...calendarWeek,
        days: calendarWeek.days.map((calendarDay: CalendarDay) => {
          const yearNum: number = +(this.datePipe.transform(day.date, "yyyy") ?? "");
          const monthNum: number = +(this.datePipe.transform(day.date, "MM") ?? "");
          const dayNum: number = +(this.datePipe.transform(day.date, "dd") ?? "");
          if (calendarDay.year == yearNum && calendarDay.month == monthNum && calendarDay.date == dayNum) {
            switch (mode) {
              case "set":
                calendarDay.day = day;
                break;
              case "remove":
                calendarDay.day.events = [];
                break;
            }
          }

          return calendarDay;
        })
      }))
    }));
  }
}
