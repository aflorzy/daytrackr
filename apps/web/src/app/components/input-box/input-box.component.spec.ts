import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonComponent } from "../button/button.component";
import { DayListComponent } from "../day-list/day-list.component";
import { ParserComponent } from "../parser/parser.component";
import { InputBoxComponent } from "./input-box.component";

describe("InputBoxComponent", () => {
  let component: InputBoxComponent;
  let fixture: ComponentFixture<InputBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [InputBoxComponent, ButtonComponent, DayListComponent, ParserComponent],
    imports: [FormsModule, ReactiveFormsModule],
    providers: [DatePipe, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();

    fixture = TestBed.createComponent(InputBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
