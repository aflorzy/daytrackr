import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DayService } from 'src/app/services/day.service';
import { Event } from 'src/common/interfaces';
import { Day } from 'src/common/interfaces';

@Component({
  selector: 'app-edit-day',
  templateUrl: './edit-day.component.html',
  styleUrls: ['./edit-day.component.css'],
})
export class EditDayComponent implements OnInit {
  // day$_original!: Observable<Day>;
  @Input() day!: Day;
  @Output() onSave = new EventEmitter<Day>();
  @Output() onCancel = new EventEmitter<boolean>();
  isModified: boolean = false;
  day_original!: Day;
  errorMessage: string = '';

  constructor(private dayService: DayService) {}

  ngOnInit(): void {
    this.day_original = JSON.parse(JSON.stringify(this.day));
  }

  identify(index: number, event: Event) {
    return event.idx;
  }

  moveUp(event: Event, day: Day) {
    const index: number = event.idx;
    const newIndex: number = index - 1;

    if (index <= 0) return;

    const temp: Event = day.events[newIndex];
    day.events[newIndex] = { ...event, idx: newIndex };
    day.events[index] = { ...temp, idx: index };

    this.day = { ...day };

    this.checkIsModified();
  }

  moveDown(event: Event, day: Day) {
    const index: number = event.idx;
    const newIndex: number = index + 1;

    if (event.idx >= day.events.length - 1) return;

    const temp: Event = day.events[newIndex];
    day.events[newIndex] = { ...event, idx: newIndex };
    day.events[index] = { ...temp, idx: index };

    this.day = { ...day };

    this.checkIsModified();
  }

  checkIsModified() {
    this.isModified = JSON.stringify(this.day_original) !== JSON.stringify(this.day);
  }

  saveChanges() {
    this.dayService.saveDay(this.day).subscribe({
      next: (res: Day) => {
        this.errorMessage = '';
        this.onSave.emit(res);
      },
      error: (e: any) => {
        this.errorMessage = 'Could not save day';
        console.error('Could not save day', e);
      },
    });
  }

  addEvent(name: string) {
    this.day.events.push({ name, idx: this.day.events.length });
    this.checkIsModified();
  }
}
