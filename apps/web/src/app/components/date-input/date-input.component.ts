import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-date-input",
  templateUrl: "./date-input.component.html",
  styleUrls: ["./date-input.component.css"]
})
export class DateInputComponent {
  regex = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;

  date?: Date;
  initialDate = "";
  invalidDate = true;
  @Input() set setInitialDate(date: Date | undefined) {
    if (!this.initialDate) {
      this.initialDate = date ? date.toISOString().split("T")[0].replaceAll("-", "/") : "";
      this.onChange();
    }
  }
  @Output() initialDateEmitter = new EventEmitter<Date>();
  @Output() invalidDateEmitter = new EventEmitter<boolean>();

  onChange() {
    this.date = new Date(this.initialDate);

    if (!this.date.getTime() || !this.regex.test(this.initialDate)) {
      this.invalidDate = true;
      this.invalidDateEmitter.emit(true);
      this.initialDateEmitter.emit(undefined);
    } else {
      this.invalidDate = false;
      this.initialDateEmitter.emit(this.date);
      this.invalidDateEmitter.emit(false);
    }
  }
}
