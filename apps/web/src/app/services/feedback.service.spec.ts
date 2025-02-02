import { TestBed } from "@angular/core/testing";

import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FeedbackService } from "./feedback.service";

describe("FeedbackService", () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [DatePipe, provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(FeedbackService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
