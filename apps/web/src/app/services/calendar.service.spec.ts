import { TestBed } from "@angular/core/testing";

import { DatePipe } from "@angular/common";
import { CalendarService } from "./calendar.service";

describe("CalendarService", () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe]
    });
    service = TestBed.inject(CalendarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
