import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { CalendarDay, CalendarMonth, Day } from '../../interfaces';
import { CalendarService } from '../../services';

@Component({
  selector: 'fzt-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  private calendarService = inject(CalendarService);

  dayList = input<Day[] | null>(null);
  initialDate = input<Date>(null);

  month = computed(() => {
    const monthListTemp = this.calendarService.initializeCalendar(
      this.initialDate(),
    );

    // Void return type handler. TODO: Fix types
    if (!monthListTemp) return null;

    let monthList: CalendarMonth[] = monthListTemp;

    if (!this.dayList()) return monthList[1];

    this.dayList().forEach((day) => {
      monthList = this.calendarService.setDay(monthListTemp, day);
    });

    return monthList[1];
  });

  selectDay(day: CalendarDay): void {
    console.log(day);
  }
}
