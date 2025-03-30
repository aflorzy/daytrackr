import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonComponent } from "../button/button.component";
import { EditDayComponent } from "./edit-day.component";

describe("EditDayComponent", () => {
  let component: EditDayComponent;
  let fixture: ComponentFixture<EditDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [EditDayComponent, ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
