import { Component } from "@angular/core";
import { FeedbackMessage, FeedbackService } from "../../../services/feedback.service";

@Component({
  selector: "app-contact-page",
  templateUrl: "./contact-page.component.html",
  styleUrls: ["./contact-page.component.css"]
})
export class ContactPageComponent {
  constructor(private feedbackService: FeedbackService) {}

  handleSubmit(form: FeedbackMessage) {
    this.feedbackService.sendFeedback(form).subscribe({
      next: _ => {
        console.log("Sent successfully");
      },
      error: _ => {
        console.error("Could not send feedback");
      }
    });
  }
}
