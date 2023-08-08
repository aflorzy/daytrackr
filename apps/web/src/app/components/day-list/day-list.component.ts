import { Component, Input } from '@angular/core';
import { Day } from '../input-box/input-box.component';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.css'],
})
export class DayListComponent {
  @Input() days: Day[] = [];

  editDay(day: Day, index: number) {
    this.days.splice(index, 1, day);
    console.log(this.days);
  }
}
