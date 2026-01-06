import { formatDate } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { CalendarDay, CalendarMonth, CalendarService, Day as DayObj } from "@fzt/calendar";
import { defer, filter, map, Observable } from "rxjs";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnChanges {
  private calendarService = inject(CalendarService);

  @Input() dayList!: DayObj[];
  @Input() initialDate!: Date;
  @Input() monthDropdownData: { month: number; year: number }[] = [];
  @Output() dayChange = new EventEmitter<CalendarDay>();
  @Output() newDayClick = new EventEmitter<CalendarDay>();
  @Output() calendarDateRange = new EventEmitter<{ first: Date; last: Date }>();

  @Output() monthChange: Observable<{ month: number; year: number } | null> = defer(() =>
    this.monthDropdownForm.valueChanges.pipe(
      filter(
        formValue =>
          !!(
            formValue?.data &&
            formValue.data > -1 &&
            this.initialDate &&
            this.monthDropdownData &&
            !(
              this.monthDropdownData[formValue.data].month === new Date(this.initialDate).getUTCMonth() &&
              this.monthDropdownData[formValue.data].year === new Date(this.initialDate).getUTCFullYear()
            )
          )
      ),
      map(formValue => {
        const monthDropdownIndex: number = formValue?.data ?? -1;

        if (monthDropdownIndex >= 0) return this.monthDropdownData[monthDropdownIndex];

        return null;
      })
    )
  );

  monthList: CalendarMonth[] = [];
  monthListInitial: CalendarMonth[] = [];
  selectedDate?: Date;

  monthDropdownForm = new FormGroup({
    data: new FormControl(-1, [])
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dayList && this.dayList) {
      this.initializeDayList(this.dayList);
    }

    if (this.initialDate && this.monthDropdownData) {
      this.autoSelectMonthDropdown(new Date(this.initialDate), this.monthDropdownData);

      this.initializeCalendar(this.initialDate);
    }
  }

  private autoSelectMonthDropdown(initialDate: Date, monthDropdownData: { month: number; year: number }[]) {
    // Set initial month dropdown value
    const monthData: { month: number; year: number } = {
      month: initialDate.getUTCMonth(),
      year: initialDate.getUTCFullYear()
    };

    const initialDataMonthDataIndex = monthDropdownData.findIndex(
      monthDataTemp => monthDataTemp.month === monthData.month && monthDataTemp.year === monthData.year
    );

    this.monthDropdownForm.patchValue({
      data: initialDataMonthDataIndex
    });
  }

  /** Begin Month Dropdown Functions */

  formatMonthDropdownItem(monthData: { month: number; year: number }): string {
    const monthDate = new Date(monthData.year, monthData.month, 1);
    const formattedDate: string = formatDate(monthDate, "MMMM YYYY", "en-us");

    return formattedDate;
  }

  trackByIndex(index: number) {
    return index;
  }

  /** End Month Dropdown Functions */

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
    this.calendarDateRange.emit({
      first: monthListTemp[0].weeks[0].days[0].day.date,
      last: monthListTemp[monthListTemp.length - 1].weeks[5].days[6].day.date
    });
  }

  selectDay(day: CalendarDay) {
    if (day.day.events.length <= 0) {
      this.newDayClick.emit(day);
      return;
    }
    this.dayChange.emit(day);
  }
}
