import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideMockStore } from "@ngrx/store/testing";
import { EditDayPageComponent } from "./edit-day-page.component";

describe("EditDayPageComponent", () => {
  let component: EditDayPageComponent;
  let fixture: ComponentFixture<EditDayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDayPageComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
