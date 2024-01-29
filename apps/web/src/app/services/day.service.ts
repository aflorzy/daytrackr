import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Day, Event } from "src/app/interfaces";
import { BASE_URL } from "../constants";

@Injectable({
  providedIn: "root"
})
export class DayService {
  day!: Day;
  days: Day[];

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    const days = localStorage.getItem("days") || "[]";
    this.days = JSON.parse(days);
  }

  // Sorting events by index ASC
  private sortDayEvents(day: Day): Day {
    if (!day) return day;

    return {
      ...day,
      events: day?.events?.sort((curr: Event, prev: Event) => curr.idx - prev.idx)
    };
  }

  public getDayByDate(date: Date): Observable<Day> {
    console.log("Day by date", date);
    return this.http
      .get<Day>(`${BASE_URL}/daily-events/find/date/${date}`)
      .pipe(map((day: Day) => this.sortDayEvents(day)));
  }

  public getDayById(id: string): Observable<Day> {
    return this.http
      .get<Day>(`${BASE_URL}/daily-events/find/date/${id}`)
      .pipe(map((day: Day) => this.sortDayEvents(day)));
  }

  public getToday(): Observable<Day> {
    return this.http.get<Day>(`${BASE_URL}/daily-events/find/today`).pipe(map((day: Day) => this.sortDayEvents(day)));
  }

  public getLatest(): Observable<Day> {
    return this.http.get<Day>(`${BASE_URL}/daily-events/find/latest`).pipe(map((day: Day) => this.sortDayEvents(day)));
  }

  public getAllDays(): Observable<Day[]> {
    return this.http
      .get<Day[]>(`${BASE_URL}/daily-events/find/all`)
      .pipe(map((dayList: Day[]) => dayList.map((day: Day) => this.sortDayEvents(day))));
  }

  public getDaysBetween(date1: Date, date2: Date): Observable<Day[]> {
    const dateStr1: string = this.datePipe.transform(date1, "yyyy-MM-dd") ?? "";
    const dateStr2: string = this.datePipe.transform(date2, "yyyy-MM-dd") ?? "";

    return this.http
      .get<Day[]>(`${BASE_URL}/daily-events/find/between?date1=${dateStr1}&date2=${dateStr2}`)
      .pipe(map((dayList: Day[]) => dayList.map((day: Day) => this.sortDayEvents(day))));
  }

  public saveDay(newDay: Day): Observable<Day> {
    return this.http
      .post<Day>(`${BASE_URL}/daily-events/save`, newDay)
      .pipe(map((day: Day) => this.sortDayEvents(day)));
  }

  public saveMulti(days: Day[]): Observable<Day[]> {
    return this.http
      .post<Day[]>(`${BASE_URL}/daily-events/save/multi`, days)
      .pipe(map((dayList: Day[]) => dayList.map((day: Day) => this.sortDayEvents(day))));
  }

  public deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/daily-events/delete/${id}`);
  }
}
