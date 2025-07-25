import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject } from "rxjs";
import { DAYS_OF_WEEK } from "src/app/constants";
import { Day } from "src/app/interfaces";
import { DayService } from "src/app/services/day.service";
import { ParserService } from "src/app/services/parser.service";

@UntilDestroy()
@Component({
  selector: "app-input-box",
  templateUrl: "./input-box.component.html",
  styleUrls: ["./input-box.component.scss"]
})
export class InputBoxComponent implements OnInit {
  private datePipe = inject(DatePipe);
  private dayService = inject(DayService);
  private parserService = inject(ParserService);

  value = "";
  realInitialDate?: Date;
  initialDate?: Date;
  invalidDate = true;
  date?: Date;
  days: Day[] = [];
  daysSaved = false;

  error$ = new BehaviorSubject({ isError: false, errorMsg: "" });

  ngOnInit(): void {
    this.initFields();
  }

  initFields() {
    if (localStorage.getItem("fields")) {
      const fields = JSON.parse(localStorage.getItem("fields") ?? "");
      if (fields.date && fields.text) {
        this.initialDate = new Date(fields.date);
        this.value = fields.text;
      }
    }

    if (localStorage.getItem("days")) {
      this.daysSaved = true;
    }
  }

  setError(isError: boolean, errorMsg: string) {
    this.error$.next({ isError: isError, errorMsg: errorMsg });

    if (isError) this.reset();
  }

  reset() {
    this.days = [];
    this.initialDate = this.realInitialDate ? this.realInitialDate : this.initialDate;
    this.date = undefined;
  }

  onSubmit() {
    let errorMsg = "";
    const days: Day[] = [];
    let dayOfWeekIdx = -1;
    this.realInitialDate = this.initialDate;
    this.value.split("\n").forEach((line, index1) => {
      line = line.trim();
      if (line === "") {
        // Ignore empty lines
        return;
      }

      // Check if line starts with DAY_OF_WEEK
      const dayOfWeek = DAYS_OF_WEEK.find(day => line.startsWith(day + "-"));

      if (!dayOfWeek) {
        // Did not find 'Saturday-'... at beginning of line
        errorMsg = `Error parsing day at line ${index1}. '${line}'`;
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }

      if (
        dayOfWeekIdx !== -1 &&
        DAYS_OF_WEEK.indexOf(dayOfWeek) !== dayOfWeekIdx + 1 &&
        !(DAYS_OF_WEEK.indexOf(dayOfWeek) === 0 && dayOfWeekIdx === DAYS_OF_WEEK.length - 1)
      ) {
        errorMsg = `Dates out of order at line ${index1}. Expected ${DAYS_OF_WEEK[dayOfWeekIdx + 1 >= DAYS_OF_WEEK.length ? 0 : dayOfWeekIdx + 1]} but got ${dayOfWeek}. '${line}'`;
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }

      // Expect day to equal datePipe.transform of initialDate
      if (!this.initialDate) {
        errorMsg = "Initial date not set!";
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }
      this.date = new Date(this.initialDate);
      const expectedDay = this.datePipe.transform(this.date, "EEEE");

      if (dayOfWeek !== expectedDay) {
        errorMsg = `Expected date at line ${index1} to be ${expectedDay} but got ${dayOfWeek}. '${line}'`;
        this.setError(true, errorMsg);
        throw new Error(errorMsg);
      }

      dayOfWeekIdx = DAYS_OF_WEEK.indexOf(dayOfWeek);
      line = line.replace(dayOfWeek + "-", "");

      const day: Day = {
        date: this.date,
        events: line.split(",").map((event, index) => ({ name: event.trim(), idx: index }))
      };

      // Remove empty events
      day.events = day.events.filter(event => event.name !== "");

      days.push(day);

      const newDate = new Date(this.initialDate);
      newDate.setUTCDate(newDate.getUTCDate() + 1);
      this.initialDate = newDate;
    });

    this.initialDate = this.realInitialDate;
    this.date = undefined;
    this.days = days;
    errorMsg = "";
    this.setError(false, errorMsg);
  }

  saveData() {
    // Loop through events and replace all &nbsp; with spaces
    // const daysFinal: Day[] = this.days.map((day) => {
    //   const events: Event[] = day.events.map((event) => {
    //     return { ...event, name: event.name.replace(/&nbsp;/g, ' ') };
    //   });

    //   return { ...day, events };
    // });

    this.daysSaved = true;

    console.log("Saved", this.days);
    return;

    this.dayService
      .saveMulti(this.days)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (result: Day[]) => {
          this.days = result;
        },
        error: (e: HttpErrorResponse) => {
          console.error("Could not save days", e);
        }
      });
  }

  parseText() {
    const dayText: string = this.value;
    const initialDate: Date = new Date("2024/01/28");

    const dayList: Day[] = this.parserService.parseDayText(dayText, initialDate);

    console.log(dayList);
  }
}
