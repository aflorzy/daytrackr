import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { StatusType } from "../../../enums";
import { FeedbackMessage } from "../../../interfaces";
import { FeedbackService } from "../../../services/feedback.service";
import { ButtonComponent } from "../../button/button.component";
import { FeedbackComponent } from "../feedback/feedback.component";
import { ContactPageComponent } from "./contact-page.component";

describe("ContactPageComponent", () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let feedbackService: FeedbackService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
      declarations: [ContactPageComponent, FeedbackComponent, ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactPageComponent);

    feedbackService = TestBed.inject(FeedbackService);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should send feedback to the service upon submit", fakeAsync(() => {
    spyOn(feedbackService, "sendFeedback").and.returnValue(of({}));
    spyOn(component.resetForm$, "next");
    spyOn(component.responseMessage$, "next");

    const feedback: FeedbackMessage = {
      subject: "Subject line",
      body: "This is my message",
      attachments: []
    };

    component.handleSubmit(feedback);

    expect(feedbackService.sendFeedback).toHaveBeenCalledWith(feedback);

    // TODO: How to test the logic inside the subscribe block?
    // expect(component.resetForm$.next).toHaveBeenCalledWith(true);

    expect(component.responseMessage$.next).toHaveBeenCalledWith({
      message: "Sent successfully.",
      statusType: StatusType.SUCCESS
    });

    // Simulate the passage of time
    tick(5000);

    // Verify the response message is cleared after 5 seconds
    expect(component.responseMessage$.next).toHaveBeenCalledWith(null);
  }));
});
