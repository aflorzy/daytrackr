import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-date-input",
  templateUrl: "./date-input.component.html",
  styleUrls: ["./date-input.component.scss"]
})
export class DateInputComponent implements OnChanges {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    date: ["", [Validators.required, Validators.pattern(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)]]
  });

  @Input() initialDate!: Date;
  // @Output() dateChanged = this.form.valueChanges.pipe(map(formValue => formValue.date));
  @Output() dateChanged = new EventEmitter<Date>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialDate && this.initialDate) {
      this.form.patchValue({ date: this.convertDateToString(new Date(this.initialDate)) });
    }
  }

  convertDateToString(date: Date): string {
    const year: number = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const dayStr = `${year}-${month}-${day}`;
    return dayStr;
  }

  handleBlur(date: Date) {
    this.dateChanged.emit(date);
  }
}
