import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Event as DailyEvent, Day } from "@fzt/calendar";

@Component({
  selector: "app-day-list-item",
  templateUrl: "./day-list-item.component.html",
  styleUrls: ["./day-list-item.component.scss"]
})
export class DayListItemComponent {
  @Input() day?: Day;
  @Input() editable!: boolean;
  @Input() hideEditIcon!: boolean;
  @Input() hideDeleteIcon!: boolean;
  @Input() hideAddEvent!: boolean;
  @Output() enterEditMode = new EventEmitter<void>();
  @Output() deleteDay = new EventEmitter<void>();
  @Output() combineEvents = new EventEmitter<{ event1: DailyEvent; event2: DailyEvent }>();
  @Output() addEvent = new EventEmitter<string>();
  @Output() saveEvent = new EventEmitter<DailyEvent>();

  editingEvent = "";
  originalEvent = "";

  eventForm = new FormGroup({
    eventInput: new FormControl("")
  });

  editEvent(event: Event) {
    if (!this.editable) return;

    const inputElement = event.target as HTMLInputElement;

    this.editingEvent = inputElement.innerHTML.trim();
  }

  focusCell(index: number) {
    if (!this.day || index >= this.day.events.length || !this.editable) return;
    this.editingEvent = this.day.events[index].name;
    this.originalEvent = this.editingEvent;
  }

  delete() {
    if (window.confirm("Are you sure you want to delete this day?")) {
      this.deleteDay.emit();
    }
  }

  submit(e: Event, event: DailyEvent, index: number) {
    if (!this.day || index >= this.day.events.length || !this.editable || this.editingEvent === this.originalEvent)
      return;

    if (e.type === "blur" && this.editingEvent === "" && this.originalEvent !== this.day.events[index].name) {
      return;
    }

    this.saveEvent.emit({ ...event, name: this.editingEvent });
    this.editingEvent = "";
  }

  decrementIndices(index: number) {
    if (!this.day) return;

    for (let i = index + 1; i < this.day.events.length; i++) {
      this.day.events[i].idx--;
    }
  }
}
