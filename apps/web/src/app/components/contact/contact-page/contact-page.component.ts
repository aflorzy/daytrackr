import { Component, inject } from "@angular/core";
import { NonNullableFormBuilder } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, catchError, concat, delay, of, switchMap, tap } from "rxjs";
import { StatusType } from "../../../enums";
import { FeedbackMessage, ResponseMessage } from "../../../interfaces";
import { FeedbackService } from "../../../services/feedback.service";

@UntilDestroy()
@Component({
  selector: "app-contact-page",
  templateUrl: "./contact-page.component.html",
  styleUrls: ["./contact-page.component.scss"]
})
export class ContactPageComponent {
  private feedbackService = inject(FeedbackService);
  private fb = inject(NonNullableFormBuilder);
  private response$ = new BehaviorSubject<ResponseMessage | null>(null);

  contactForm = this.fb.group({});

  responseMessage$ = this.response$.pipe(
    switchMap(message =>
      message
        ? concat(
            of(message), // Emit message immediately
            of(null).pipe(delay(5000)) // Emit null after 5 seconds
          )
        : of(null)
    )
  );

  sendFeedbackIsLoading$ = new BehaviorSubject(false);

  handleSubmit(payload: FeedbackMessage) {
    this.sendFeedbackIsLoading$.next(true);

    this.feedbackService
      .sendFeedback(payload)
      .pipe(
        tap(() => {
          this.sendFeedbackIsLoading$.next(false);
          this.contactForm.reset();
        }),
        switchMap(() => of({ message: "Sent successfully.", statusType: StatusType.SUCCESS })),
        catchError(() => {
          this.sendFeedbackIsLoading$.next(false);

          return of({ message: "Could not send feedback.", statusType: StatusType.ERROR });
        }),
        tap(responseMessage => {
          this.response$.next(responseMessage);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
