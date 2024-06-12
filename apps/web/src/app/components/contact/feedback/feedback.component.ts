import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { FeedbackMessage, ResponseMessage } from "src/app/interfaces";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"]
})
export class FeedbackComponent implements OnChanges {
  @Input() responseMessage!: ResponseMessage | null;
  @Input() resetForm!: boolean;
  @Output() submitForm = new EventEmitter<FeedbackMessage>();

  feedbackForm = this.fb.group({
    subject: new FormControl("", [Validators.required]),
    message: new FormControl("", [Validators.required]),
    file: new FormControl(null)
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetForm && this.resetForm) {
      this.feedbackForm.reset();
    }
  }

  hasError(fieldName: string, error: string): boolean {
    const field = this.feedbackForm.get(fieldName);
    return !!(field?.touched && field?.hasError(error));
  }

  onSubmit() {
    const feedbackFormValue = this.feedbackForm.value;

    const feedbackMessage: FeedbackMessage = {
      subject: feedbackFormValue.subject ?? "",
      body: feedbackFormValue.message ?? "",
      attachments: [feedbackFormValue.file]
    };
    this.submitForm.emit(feedbackMessage);
  }

  validateFileType(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return allowedTypes.includes(file?.type);
  }
}
