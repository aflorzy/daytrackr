import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FeedbackMessage } from "../../../services/feedback.service";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent {
  @Output() submitForm = new EventEmitter<FeedbackMessage>();

  feedbackForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      subject: ["", Validators.required],
      message: ["", Validators.required],
      file: [null, [Validators.required, this.validateFileType]]
    });
  }

  hasError(fieldName: string, error: string): boolean {
    const field = this.feedbackForm.get(fieldName);
    return !!(field?.touched && field?.hasError(error));
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.submitForm.emit(this.feedbackForm.getRawValue());
    } else {
      console.error("Form invalid");
    }
    this.submitForm.emit(this.feedbackForm.getRawValue());
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file && this.validateFileType(file)) {
      this.feedbackForm.patchValue({ file });
    } else {
      this.feedbackForm.patchValue({ file: null });
      event.target.value = null; // Clear the input
    }

    console.log(this.feedbackForm.getRawValue());
  }

  validateFileType(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return allowedTypes.includes(file?.type);
  }
}
