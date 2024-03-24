import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Day } from "src/app/interfaces";
import { ParserService } from "src/app/services/parser.service";

@Component({
  selector: "app-parser",
  templateUrl: "./parser.component.html",
  styleUrls: ["./parser.component.css"]
})
export class ParserComponent {
  parserForm: FormGroup = new FormGroup({
    date: new FormControl("", [Validators.required]),
    text: new FormControl("", [Validators.required])
  });

  dayList$: BehaviorSubject<Day[]> = new BehaviorSubject<Day[]>([]);

  constructor(private parserService: ParserService) {}

  submit(formValue: any) {
    const hyphenRegex = /-/gi;
    const initialDate: Date = new Date(formValue.date.replace(hyphenRegex, "/"));
    console.log("Converting date", formValue.date, initialDate);
    const dayList: Day[] = this.parserService.parseDayText(formValue.text, initialDate);

    this.dayList$.next(dayList);

    console.log("DayList", dayList);
  }
}
