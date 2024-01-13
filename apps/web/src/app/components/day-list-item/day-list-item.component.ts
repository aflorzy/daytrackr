import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Day, Event } from "src/common/interfaces";

@Component({
  selector: "app-day-list-item",
  templateUrl: "./day-list-item.component.html",
  styleUrls: ["./day-list-item.component.css"]
})
export class DayListItemComponent {
  @Input() day?: Day;
  @Input() editable!: boolean;
  @Input() hideEditIcon!: boolean;
  @Input() hideAddEvent!: boolean;
  @Output() edited = new EventEmitter<Day>();
  @Output() edit = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<boolean>();
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

  submit(e: any, index: number) {
    if (!this.day || index >= this.day.events.length || !this.editable) return;

    if (e.type === "blur" && this.editingEvent === "" && this.originalEvent !== this.day.events[index].name) {
      return;
    }

    if (this.editingEvent === "") {
      // Remove empty event
      this.day.events.splice(index, 1);
      this.decrementIndices(index - 1);
    } else {
      this.day.events.splice(index, 1, {
        name: this.editingEvent,
        idx: index
      });
    }

    this.editingEvent = "";
    this.edited.emit(this.day);
  }

  combineEvents(index: number) {
    if (!this.day || !this.editable) return;

    const combinedEvent: Event = {
      name: this.day.events[index].name + ", " + this.day.events[index + 1].name,
      idx: index
    };

    // Insert combined event
    this.day.events.splice(index, 2, combinedEvent);

    // Decrement indices after the combined event
    this.decrementIndices(index);

    this.editingEvent = "";
    this.edited.emit(this.day);
  }

  decrementIndices(index: number) {
    if (!this.day) return;

    for (let i = index + 1; i < this.day.events.length; i++) {
      this.day.events[i].idx--;
    }
  }

  addEvent(name: string) {
    this.day?.events.push({ name, idx: this.day?.events.length });

    this.edited.emit(this.day);
  }
}
