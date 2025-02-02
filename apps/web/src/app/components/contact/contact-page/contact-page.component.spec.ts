import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { delay, of, throwError } from "rxjs";
import { StatusType } from "../../../enums";
import { FeedbackMessage, ResponseMessage } from "../../../interfaces";
import { FeedbackService } from "../../../services/feedback.service";
import { BannerComponent } from "../../banner/banner.component";
import { ButtonComponent } from "../../button/button.component";
import { FeedbackComponent } from "../feedback/feedback.component";
import { ContactPageComponent } from "./contact-page.component";

describe("ContactPageComponent", () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let feedbackService: FeedbackService;

  const feedbackElement = (): FeedbackComponent =>
    fixture.debugElement.query(By.css("app-feedback")).componentInstance as FeedbackComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ContactPageComponent, FeedbackComponent, ButtonComponent, BannerComponent],
    imports: [FormsModule, ReactiveFormsModule],
    providers: [FeedbackService, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();

    fixture = TestBed.createComponent(ContactPageComponent);

    feedbackService = TestBed.inject(FeedbackService);

    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should set response message when send feedback succeeded", () => {
    const feedbackApiResponse: ResponseMessage = {
      message: "Feedback submitted successfully.",
      statusType: StatusType.SUCCESS
    };
    const expectedResponseMessage: ResponseMessage = {
      message: "Sent successfully.",
      statusType: StatusType.SUCCESS
    };

    spyOn(feedbackService, "sendFeedback").and.returnValue(of(feedbackApiResponse));

    fixture.detectChanges();

    expect(feedbackElement().responseMessage).toBeNull();

    component.handleSubmit(<FeedbackMessage>{});

    fixture.detectChanges();

    expect(feedbackElement().responseMessage).toEqual(expectedResponseMessage);
  });

  it("should set response message when send feedback failed", () => {
    const expectedResponseMessage: ResponseMessage = {
      message: "Could not send feedback.",
      statusType: StatusType.ERROR
    };
    const errorResponse = new HttpErrorResponse({ error: "Could not send feedback." });

    spyOn(feedbackService, "sendFeedback").and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(feedbackElement().responseMessage).toBeNull();

    component.handleSubmit(<FeedbackMessage>{});

    fixture.detectChanges();

    expect(feedbackElement().responseMessage).toEqual(expectedResponseMessage);
  });

  it("should dismiss response message after 5 seconds", fakeAsync(() => {
    const feedbackApiResponse: ResponseMessage = {
      message: "Feedback submitted successfully.",
      statusType: StatusType.SUCCESS
    };
    const expectedResponseMessage: ResponseMessage = {
      message: "Sent successfully.",
      statusType: StatusType.SUCCESS
    };

    spyOn(feedbackService, "sendFeedback").and.returnValue(of(feedbackApiResponse));

    fixture.detectChanges();

    component.handleSubmit(<FeedbackMessage>{});

    fixture.detectChanges();

    expect(feedbackElement().responseMessage).toEqual(expectedResponseMessage);

    tick(5000);

    fixture.detectChanges();

    expect(feedbackElement().responseMessage).toBeNull();
  }));

  it("should set loading while send feedback is in progress", fakeAsync(() => {
    const feedbackApiResponse: ResponseMessage = {
      message: "Feedback submitted successfully.",
      statusType: StatusType.SUCCESS
    };

    spyOn(feedbackService, "sendFeedback").and.returnValue(of(feedbackApiResponse).pipe(delay(1000)));

    fixture.detectChanges();

    expect(feedbackElement().sendFeedbackIsLoading).toBeFalse();

    component.handleSubmit(<FeedbackMessage>{});

    fixture.detectChanges();

    expect(feedbackElement().sendFeedbackIsLoading).toBeTrue();

    // Factor in simulated API delay and message auto-dismiss timer
    tick(1000 + 5000);

    fixture.detectChanges();

    expect(feedbackElement().sendFeedbackIsLoading).toBeFalse();
  }));

  it("should reset the contact form when send feedback succeeds", () => {
    const feedbackApiResponse: ResponseMessage = {
      message: "Feedback submitted successfully.",
      statusType: StatusType.SUCCESS
    };

    spyOn(feedbackService, "sendFeedback").and.returnValue(of(feedbackApiResponse));
    spyOn(component.contactForm, "reset").and.callThrough();

    fixture.detectChanges();

    expect(component.contactForm.reset).not.toHaveBeenCalled();

    component.handleSubmit(<FeedbackMessage>{});

    fixture.detectChanges();

    expect(component.contactForm.reset).toHaveBeenCalled();
  });
});
