import { TestBed } from "@angular/core/testing";

import { DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { DayService } from "./day.service";

describe("DayService", () => {
  let service: DayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DatePipe]
    });
    service = TestBed.inject(DayService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
