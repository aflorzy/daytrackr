import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Day, Event } from "src/app/interfaces";

@Component({
  selector: "app-edit-day",
  templateUrl: "./edit-day.component.html",
  styleUrls: ["./edit-day.component.scss"]
})
export class EditDayComponent {
  @Input() day!: Day;
  @Input() isChanged = false;
  @Output() saveEdits = new EventEmitter<Day>();
  @Output() cancelEdits = new EventEmitter<boolean>();
  @Output() moveEventUp = new EventEmitter<Event>();
  @Output() moveEventDown = new EventEmitter<Event>();
  @Output() moveEvent = new EventEmitter<{ event: Event; newIdx: number }>();
  @Output() removeEvent = new EventEmitter<Event>();
  @Output() addEvent = new EventEmitter<string>();

  eventForm = new FormGroup({
    eventInput: new FormControl("")
  });
}
