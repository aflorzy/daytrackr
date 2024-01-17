import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CalendarDay, CalendarMonth, CalendarWeek, Day as DayObj } from "src/common/interfaces";
import { CalendarService } from "../../../services/calendar.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnChanges {
  @Input() dayList!: DayObj[];
  @Input() deletedDay!: DayObj | null;
  @Input() initialDate!: Date;
  @Output() dayChange = new EventEmitter<CalendarDay>();
  @Output() newDayClick = new EventEmitter<CalendarDay>();
  @Output() firstLastDate = new EventEmitter<{ first: Date; last: Date }>();

  monthList: CalendarMonth[] = [];
  monthListInitial: CalendarMonth[] = [];
  selectedDate?: Date;

  constructor(
    private datePipe: DatePipe,
    private calendarService: CalendarService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deletedDay && this.deletedDay) {
      this.handleDeletedDay(this.deletedDay);
    }

    if (changes.initialDate && this.initialDate) {
      this.initializeCalendar(this.initialDate);
    }

    if (changes.dayList && this.dayList) {
      this.initializeDayList(this.dayList);
    }
  }

  private handleDeletedDay(deletedDay: DayObj) {
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
  }

  private initializeDayList(dayList: DayObj[]) {
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

  private initializeCalendar(date: Date) {
    const monthChanged: boolean =
      this.datePipe.transform(this.selectedDate, "MM") !== this.datePipe.transform(date, "MM");
    const shouldEmitFirstLast: boolean = !this.selectedDate || monthChanged;
    this.selectedDate = date;

    if (!shouldEmitFirstLast) return;

    const currentMonth: CalendarMonth = {
      ...this.calendarService.monthFromDate(date)
    };

    const previousMonthDate: Date = new Date(date);
    previousMonthDate.setDate(15);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const previousMonth: CalendarMonth = {
      ...this.calendarService.monthFromDate(previousMonthDate)
    };

    const nextMonthDate: Date = new Date(date);
    nextMonthDate.setDate(15);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonth: CalendarMonth = { ...this.calendarService.monthFromDate(nextMonthDate) };

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

  selectDay(day: CalendarDay, month: CalendarMonth) {
    if (day.month !== month.monthOfYear) return;
    if (day.day.events.length <= 0) {
      this.newDayClick.emit(day);
      return;
    }
    this.dayChange.emit(day);
  }
}
