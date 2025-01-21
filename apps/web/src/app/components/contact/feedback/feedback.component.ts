import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { FeedbackMessage, ResponseMessage } from "src/app/interfaces";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"]
})
export class FeedbackComponent {
  private fb = inject(FormBuilder);

  @Input() responseMessage!: ResponseMessage | null;
  @Input() set resetForm(shouldReset: boolean) {
    if (shouldReset) {
      this.feedbackForm.reset();
    }
  }
  @Output() submitForm = new EventEmitter<FeedbackMessage>();

  feedbackForm = this.fb.group({
    subject: new FormControl("", [Validators.required]),
    message: new FormControl("", [Validators.required]),
    file: new FormControl<File | null>(null)
  });

  hasError(fieldName: string, error: string): boolean {
    const field = this.feedbackForm.get(fieldName);
    return !!(field?.touched && field?.hasError(error));
  }

  handleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const files = inputElement.files;

    if (!files?.length) {
      this.feedbackForm.get("file")?.reset();

      return;
    }

    this.feedbackForm.patchValue({ file: files[0] });
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
