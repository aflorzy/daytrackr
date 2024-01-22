import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CalendarDay, CalendarMonth, Day as DayObj } from "src/app/interfaces";
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
    this.monthList = this.calendarService.removeDay(this.monthListInitial, deletedDay);
  }

  private initializeDayList(dayList: DayObj[]) {
    // Loop through dayList and set on appropriate calendar day
    dayList.forEach((day: DayObj) => {
      this.monthList = this.calendarService.setDay(this.monthListInitial, day);
    });
  }

  private initializeCalendar(date: Date) {
    const monthListTemp = this.calendarService.initializeCalendar(date, this.selectedDate);
    this.selectedDate = date;
    if (!monthListTemp) return;

    this.monthList = monthListTemp;
    this.monthListInitial = [...monthListTemp];

    // Only emit these when month has changed
    this.firstLastDate.emit({
      first: monthListTemp[0].weeks[0].days[0].day.date,
      last: monthListTemp[monthListTemp.length - 1].weeks[5].days[6].day.date
    });
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
