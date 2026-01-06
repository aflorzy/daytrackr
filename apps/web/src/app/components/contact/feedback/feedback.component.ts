import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { FeedbackMessage, ResponseMessage } from "../../../interfaces";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"]
})
export class FeedbackComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  @Input() parentForm!: FormGroup;
  @Input() responseMessage!: ResponseMessage | null;
  @Input() sendFeedbackIsLoading = false;
  @Output() submitForm = new EventEmitter<FeedbackMessage>();

  subjectControl = this.fb.control("", [Validators.required]);
  messageControl = this.fb.control("", [Validators.required]);
  fileControl = this.fb.control<File | null>(null);

  feedbackForm = this.fb.group({
    subject: this.subjectControl,
    message: this.messageControl,
    file: this.fileControl
  });

  ngOnInit(): void {
    this.parentForm.addControl("feedback", this.feedbackForm);
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
      attachments: feedbackFormValue.file ? [feedbackFormValue.file] : []
    };

    this.submitForm.emit(feedbackMessage);
  }

  validateFileType(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return allowedTypes.includes(file?.type);
  }
}
