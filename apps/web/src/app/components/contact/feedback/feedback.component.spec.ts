import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonComponent } from "../../button/button.component";
import { FeedbackComponent } from "./feedback.component";

describe("FeedbackComponent", () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [FeedbackComponent, ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;

    component.parentForm = new FormGroup({});
  });

  it("should create", () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
