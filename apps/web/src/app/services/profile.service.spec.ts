import { TestBed } from "@angular/core/testing";

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ProfileService } from "./profile.service";

describe("ProfileService", () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(ProfileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
