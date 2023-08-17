import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { DayService } from "src/app/services/day.service";
import { Day, Event } from "../input-box/input-box.component";

@Component({
  selector: "app-edit-day",
  templateUrl: "./edit-day.component.html",
  styleUrls: ["./edit-day.component.css"],
})
export class EditDayComponent implements OnInit {
  day$!: Observable<Day>;
  day$_original!: Observable<Day>;
  day_original!: Day;
  @Output() onSave = new EventEmitter<Day>();
  @Output() onCancel = new EventEmitter<boolean>();
  @Input() date!: Date;

  identify(index: number, event: Event) {
    return event.index;
  }

  constructor(private dayService: DayService) {}

  ngOnInit(): void {
    this.day$ = this.dayService.getDay(this.date);
    this.day$_original = this.day$;
  }

  moveUp(event: Event, day: Day) {
    const index: number = event.index;
    const newIndex: number = index - 1;

    if (index <= 0) return;

    const temp: Event = day.events[newIndex];
    day.events[newIndex] = { ...event, index: newIndex };
    day.events[index] = { ...temp, index };
  }

  moveDown(event: Event, day: Day) {
    const index: number = event.index;
    const newIndex: number = index + 1;

    if (event.index >= day.events.length - 1) return;

    const temp: Event = day.events[newIndex];
    day.events[newIndex] = { ...event, index: newIndex };
    day.events[index] = { ...temp, index };
  }

  compare(day1: Day | null, day2: Day | null) {
    if (!day1 || !day2) return;

    if (!this.day_original)
      this.day_original = JSON.parse(JSON.stringify(day2));

    return JSON.stringify(day1) !== JSON.stringify(this.day_original);
  }

  saveChanges(day: Day) {
    this.day$ = this.dayService.saveDay(day);
    this.day_original = JSON.parse(JSON.stringify(day));
    this.onSave.emit(this.day_original);
  }
}
