import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Day } from "@fzt/calendar";
import { BehaviorSubject } from "rxjs";
import { ParserService } from "../../services/parser.service";

@Component({
  selector: "app-parser",
  templateUrl: "./parser.component.html",
  styleUrls: ["./parser.component.scss"]
})
export class ParserComponent {
  private parserService = inject(ParserService);

  parserForm = new FormGroup({
    date: new FormControl("", [Validators.required]),
    text: new FormControl("", [Validators.required])
  });

  dayList$: BehaviorSubject<Day[]> = new BehaviorSubject<Day[]>([]);

  submit() {
    const formValue = this.parserForm.getRawValue();
    const hyphenRegex = /-/gi;
    const initialDate = formValue.date ? new Date(formValue.date.replace(hyphenRegex, "/")) : new Date();
    console.log("Converting date", formValue.date, initialDate);
    const dayList: Day[] = this.parserService.parseDayText(formValue.text ?? "", initialDate);

    this.dayList$.next(dayList);

    console.log("DayList", dayList);
  }
}
