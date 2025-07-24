import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Day, Event } from "src/app/interfaces";

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
  @Output() combineEvents = new EventEmitter<{ event1: Event; event2: Event }>();
  @Output() addEvent = new EventEmitter<string>();
  @Output() saveEvent = new EventEmitter<Event>();

  editingEvent = "";
  originalEvent = "";

  eventForm = new FormGroup({
    eventInput: new FormControl("")
  });

  editEvent(event: any) {
    if (!this.editable) return;
    this.editingEvent = event.target.innerHTML.trim();
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

  submit(e: any, event: Event, index: number) {
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
