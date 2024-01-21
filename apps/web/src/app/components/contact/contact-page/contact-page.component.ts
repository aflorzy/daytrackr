import { Component } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Subject, switchMap, tap, timer } from "rxjs";
import { FeedbackMessage, ResponseMessage } from "src/app/interfaces";
import { StatusType } from "../../../enums";
import { FeedbackService } from "../../../services/feedback.service";

@UntilDestroy()
@Component({
  selector: "app-contact-page",
  templateUrl: "./contact-page.component.html",
  styleUrls: ["./contact-page.component.css"]
})
export class ContactPageComponent {
  responseMessage$ = new Subject<ResponseMessage | null>();
  resetForm$ = new Subject<boolean>();

  constructor(private feedbackService: FeedbackService) {}

  handleSubmit(form: FeedbackMessage) {
    this.feedbackService
      .sendFeedback(form)
      .pipe()
      .pipe(
        untilDestroyed(this),
        tap(() => this.responseMessage$.next({ message: "Sent successfully.", statusType: StatusType.SUCCESS })),
        switchMap(() => timer(5000).pipe(tap(() => this.responseMessage$.next(null))))
      )
      .subscribe({
        next: () => {
          this.resetForm$.next(true);
        },
        error: () => {
          this.responseMessage$.next({ message: "Could not send feedback.", statusType: StatusType.ERROR });
        }
      });
  }
}
