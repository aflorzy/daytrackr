import { TestBed } from "@angular/core/testing";

import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { DayService } from "./day.service";

describe("DayService", () => {
  let service: DayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DatePipe, provideHttpClient(withInterceptorsFromDi())]
    });
    service = TestBed.inject(DayService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
