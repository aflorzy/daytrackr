import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Day } from "../components/input-box/input-box.component";

@Injectable({
  providedIn: "root",
})
export class DayService {
  day!: Day;
  days: Day[];

  constructor() {
    const days = localStorage.getItem("days") || "[]";
    this.days = JSON.parse(days);
  }

  getDay(date: Date): Observable<Day> {
    const foundDay = this.days.find((day) => {
      return date === day.date;
    });
    if (foundDay) this.day = foundDay;

    return of(this.day);
  }

  saveDay(newDay: Day) {
    this.days = this.days.map((day: Day) => {
      return day.date === newDay.date ? newDay : day;
    });

    localStorage.setItem("days", JSON.stringify(this.days));

    return of(this.day);
  }
}
